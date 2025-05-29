# 🧠 NLP-Based E-Commerce Filter Extraction & Faceted Search

This project demonstrates how to convert natural language queries into structured filters for e-commerce platforms using a combination of NLP, regular expressions, schema mapping, and faceted APIs. It also showcases a flexible schema design using MongoDB for supporting category-specific dynamic attributes.

---

## 📌 Scenario 01  
**Example:**  
To convert a natural language query like:

`"HP laptop with 16GB RAM for gaming under ₹80 000 in Delhi"`

into structured filters:

---

### 🧩 Intent Extraction Strategy

#### a. Pre-processing:
The initial step involves standardizing the input query. This includes converting it to lowercase:  
`"HP laptop with 16gb ram for gaming under ₹80 000 in Delhi"`  
- Normalize case  
- Tokenize  
- Remove stop words  
- Handle currency/symbols  

#### b. Rule-Based Entity Extraction:
A predefined dictionary identifies terms like:
- `"laptop"` (product type)  
- `"HP"` (brand)  
- `"RAM"` (attribute)  
- `"gaming"` (use case/tag)  
- `"under"` (price modifier)  
- Specific city names (e.g., `"Delhi"`)

Optional: Use SpaCy with a domain-trained custom model or pre-trained transformer like BERT to identify entities such as product, location, price, brand, etc.

#### c. Regular Expressions:
Regular expressions are highly effective for extracting structured numerical and unit-based information:

- `(\d+)\s*GB\s*RAM` → Extracts `"16GB RAM"` and parses `16` as the quantity for the `"RAM"` attribute.  
- `(under|over)\s*₹?\s*(\d+\s*\d*)` → Captures `"under ₹80 000"`, normalizing `"80 000"` to `80000`.  
- `in\s*(\w+)` → Identifies location phrases like `"in Delhi"`.

#### d. Schema Mapping & Structuring:
The extracted entities are then mapped to the predefined marketplace schema. For our example, this would result in a structured query:

```json
{
  "productType": "Laptop",
  "brand": "HP",
  "filters": {
    "ram": "16GB",
    "usage": "gaming",
    "price": { "$lte": 80000 },
    "location": "Delhi"
  }
}
```

> The `usage` field might be a pre-defined tag or a specific attribute depending on the schema.

---

### 🛑 Fall-back Mechanism:
If a portion of the query cannot be confidently classified by either rules or the ML model (e.g., an ML confidence score below a threshold, or an unknown term):

#### a. Broader Keyword Search:
The unclassified segment is treated as a general keyword and used for a broader full-text search against the title and description fields of listings.

#### b. User Clarification:
On the frontend, if the system's confidence in the overall parsed query is low, a “Did you mean...?” suggestion or a gentle prompt:  
> `"We couldn't fully understand 'X', would you like to refine your search?"`  
can be displayed.

#### c. Log Unknown:
Unknown tokens/phrases are logged for offline analysis and model tuning.  
This ensures a user always gets results, even if they require a slight adjustment to their query.

---

## 2. 🗃️ Flexible Schema for Category-Specific Attributes

### (a) Relational vs. Document vs. Hybrid
I’d adopt a hybrid model using MongoDB:
- Common fields: `title`, `price`, `location` are structured.
- `attributes` field stores category-specific key-value pairs as sub-documents.
- Category collection holds an attribute schema that defines valid fields and UI config.

> This avoids migrations while allowing merchandisers to evolve attribute definitions flexibly.

### (b) Query Performance
- MongoDB supports indexing nested fields (e.g., `attributes.size`, `attributes.energy_rating`).
- For multi-attribute filtering: Use `$match` + compound filters.
- For facets: Use `$facet` or `$group` in aggregation pipelines.
- Querying attribute existence:  
  ```json
  { "attributes.energy_rating": { "$exists": true } }
  ```

---

## (c) ⚡ Dynamic Facet API Design

### API Input
```json
{
  "category": "laptops",
  "filters": {
    "brand": "HP",
    "ram": "16GB",
    "price": { "$lte": 80000 },
    "location": "Delhi",
    "use_case": "gaming"
  }
}
```

### API Output
```json
{
  "listings": [
    {
      "id": "abc123",
      "title": "HP Pavilion 16GB RAM Gaming Laptop",
      "price": 77999,
      "location": "Delhi",
      "attributes": {
        "brand": "HP",
        "ram": "16GB",
        "use_case": "gaming",
        "processor": "Intel i5",
        "graphics": "NVIDIA GTX 1650"
      }
    }
  ],
  "facets": {
    "brand": [
      { "_id": "HP", "count": 24 },
      { "_id": "Dell", "count": 15 }
    ],
    "ram": [
      { "_id": "8GB", "count": 10 },
      { "_id": "16GB", "count": 22 }
    ],
    "use_case": [
      { "_id": "gaming", "count": 18 },
      { "_id": "office", "count": 12 }
    ],
    "location": [
      { "_id": "Delhi", "count": 9 },
      { "_id": "Mumbai", "count": 6 }
    ]
  },
  "page": 1,
  "limit": 20,
  "total": 56
}
```

---

## 💡 Summary of How It Helps Frontend

- Facets help render relevant filters based on the inferred category and schema (e.g., RAM, brand, use case).
- Counts help show the number of results available per facet value.
- Frontend can dynamically build UI checkboxes/dropdowns using this response, ensuring UX stays adaptive.

---

## 📚 References

- [Named Entity Recognition - GeeksForGeeks](https://www.geeksforgeeks.org/named-entity-recognition/)  
- [Yext - Intent Recognition](https://www.yext.com/platform/features/named-entity-recognition)  
- [HelloRep - Intent Recognition Glossary](https://www.hellorep.ai/glossary/what-is-intent-recognition)  
- [Yext (Repeated)](https://www.yext.com/platform/features/named-entity-recognition)  
