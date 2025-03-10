## Agoda e-Commerce Project Team 7 (WDM PROJECT)

---

Details of clone project:

- [Project Link](https://wdm-ecommerce-ai.vercel.app/)
- Tech Stack:
  1. HTML5
  2. CSS3
  3. JavaScript
  4. React JS

---

### e-Commerce Project Team 7

#### Team Members

- Rakshit Sarkheliya – 1002112755
- Gadhiraju Sai Anusha – 1002248851
- Sudhamsh Rama - 1002210904
- Raghav Narayan Ramachandran - 1002140654
- Venkata Ravi Teja Sandram - 1002080570

#### Context of the Project:

- This project focuses on developing an e-commerce application with a React.js-based frontend.

### Requirements

- A stable internet connection and an up-to-date browser.

---

### Setup and RUN Project

1. To run this application, first clone this repository either just.

2. cd to repository directory and use the following command `npm install` to install all Dependencies.

3. To run frontend, use the following command: `npm start`.

4. Open a web browser and go to [http://localhost:3000/](http://localhost:3000/) to view the products.

---

## Routes

Once the app is running locally, the following routes are available:

### Public Routes

- `/` - Home Page (`<Main />`)
- `/signup` - Signup Page (`<Signup />`)
- `/login` - Login Page (`<Login />`)
- `/forgetpwd` - Forgot Password Page (`<ForgetPwd />`)
- `/productList` - Product Listing Page (`<ProducstList />`)
- `/favorites` - Favorite Products Page (`<FavoriteProducts />`)
- `/cart` - Shopping Cart (`<Cart />`)
- `/contact` - Contact Page (`<Contact />`)
- `/product/:id` - Product Details Page (`<ProductDetails />`)
- `/checkout` - Checkout Page (`<Checkout />`)
- `/order-confirmation` - Order Confirmation Page (`<OrderConfirmation />`)
- `/accountsettings` - Account Settings Page (`<AccountSettings />`)

### Dashboard (Protected Routes)

- `/dashboard` - Dashboard (`<Dashboard />`)
  - `/dashboard/users` - User Management (`<Users />`)
  - `/dashboard/products` - Product Management (`<Products />`)
  - `/dashboard/analytics` - Analytics Page (`<Analytics />`)

### Public Tree

The following is the folder structure of the project:

```
frontend/
│── node_modules/      # Dependencies
│── public/            # Public assets
│── src/               # Source code
│   ├── assets/        # Images, fonts, and other static assets
│   ├── components/    # Reusable UI components
│   ├── constant/      # Constants and configuration values
│   ├── context/       # Context API for global state management
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Individual page components
│   ├── routes/        # Routing configurations
│   ├── services/      # API calls and service logic
│   ├── styles/        # Global and component-specific styles
│   ├── utils/         # Utility functions and helpers
│   ├── App.js         # Main application component
│   ├── index.js       # Entry point of the React application
│   ├── index.css      # Global styles
│   ├── App.css        # Additional global styles
│── .gitignore         # Files ignored by Git
│── package.json       # Project metadata and dependencies
│── README.md          # Documentation
```
