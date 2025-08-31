-- MongoDB Database Setup Script for E-Commerce Application
-- This script creates the necessary collections and indexes for the application

-- Connect to MongoDB
use ecommerce;

-- Create collections with validation
db.createCollection("users", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["username", "email"],
         properties: {
            username: {
               bsonType: "string",
               description: "Username must be a string and is required"
            },
            email: {
               bsonType: "string",
               pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
               description: "Email must be a valid email address and is required"
            },
            name: {
               bsonType: "string",
               description: "Name must be a string"
            },
            contactNumber: {
               bsonType: "string",
               description: "Contact number must be a string"
            },
            country: {
               bsonType: "string",
               description: "Country must be a string"
            },
            oidcId: {
               bsonType: "string",
               description: "OIDC provider user ID"
            },
            oidcProvider: {
               bsonType: "string",
               description: "OIDC provider name"
            }
         }
      }
   }
});

db.createCollection("orders", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["username", "purchaseDate", "deliveryTime", "deliveryLocation", "productName", "quantity"],
         properties: {
            username: {
               bsonType: "string",
               description: "Username must be a string and is required"
            },
            purchaseDate: {
               bsonType: "date",
               description: "Purchase date must be a date and is required"
            },
            deliveryTime: {
               enum: ["10 AM", "11 AM", "12 PM"],
               description: "Delivery time must be one of the allowed values"
            },
            deliveryLocation: {
               enum: [
                  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
                  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mullaitivu",
                  "Vavuniya", "Mannar", "Puttalam", "Anuradhapura", "Polonnaruwa",
                  "Badulla", "Monaragala", "Ratnapura", "Kegalle", "Trincomalee",
                  "Batticaloa", "Ampara"
               ],
               description: "Delivery location must be a valid Sri Lankan district"
            },
            productName: {
               bsonType: "string",
               description: "Product name must be a string and is required"
            },
            quantity: {
               bsonType: "int",
               minimum: 1,
               maximum: 10,
               description: "Quantity must be an integer between 1 and 10"
            },
            message: {
               bsonType: "string",
               maxLength: 500,
               description: "Message must be a string with maximum 500 characters"
            },
            status: {
               enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
               description: "Order status must be one of the allowed values"
            },
            totalAmount: {
               bsonType: "number",
               description: "Total amount must be a number"
            }
         }
      }
   }
});

db.createCollection("products", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["name", "price"],
         properties: {
            name: {
               bsonType: "string",
               description: "Product name must be a string and is required"
            },
            description: {
               bsonType: "string",
               description: "Product description must be a string"
            },
            price: {
               bsonType: "number",
               minimum: 0,
               description: "Price must be a non-negative number"
            },
            category: {
               bsonType: "string",
               description: "Product category must be a string"
            },
            image: {
               bsonType: "string",
               description: "Product image URL must be a string"
            },
            stock: {
               bsonType: "int",
               minimum: 0,
               description: "Stock quantity must be a non-negative integer"
            }
         }
      }
   }
});

-- Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "oidcId": 1 }, { unique: true });

db.orders.createIndex({ "username": 1 });
db.orders.createIndex({ "purchaseDate": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });

db.products.createIndex({ "name": 1 });
db.products.createIndex({ "category": 1 });

-- Insert sample products
db.products.insertMany([
   {
      name: "Laptop",
      description: "High-performance laptop for work and gaming",
      price: 150000,
      category: "Electronics",
      image: "/images/products/laptop.jpg",
      stock: 50
   },
   {
      name: "Smartphone",
      description: "Latest smartphone with advanced features",
      price: 85000,
      category: "Electronics",
      image: "/images/products/smartphone.jpg",
      stock: 100
   },
   {
      name: "Headphones",
      description: "Wireless noise-cancelling headphones",
      price: 25000,
      category: "Audio",
      image: "/images/products/headphones.jpg",
      stock: 75
   },
   {
      name: "Tablet",
      description: "10-inch tablet for entertainment and productivity",
      price: 65000,
      category: "Electronics",
      image: "/images/products/tablet.jpg",
      stock: 30
   },
   {
      name: "Smartwatch",
      description: "Fitness and health tracking smartwatch",
      price: 35000,
      category: "Wearables",
      image: "/images/products/smartwatch.jpg",
      stock: 40
   }
]);

print("Database setup completed successfully!");
print("Collections created: users, orders, products");
print("Indexes created for optimal performance");
print("Sample products inserted");
