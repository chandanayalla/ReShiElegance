# ReShi Elegance - E-Commerce Website

A modern, fully responsive e-commerce website for a premium women's fashion and saree brand. Built with React.js, Bootstrap 5, and Context API.

## 🌟 Features

### Core E-Commerce Features
- **Product Browsing**: Browse sarees with detailed filtering and sorting
- **Product Search**: Real-time search functionality across products
- **Shopping Cart**: Add/remove items, update quantities
- **Wishlist**: Save favorite sarees for later
- **Checkout**: Multi-step checkout with payment options
- **Order Management**: View order history and status

### User Features
- **Authentication**: User registration and login
- **User Account**: Manage profile information and addresses
- **Order Tracking**: Track order status and history
- **Wishlist Management**: Manage saved items

### Shopping Features
- **Advanced Filtering**: Filter by category, price, color, fabric, occasion
- **Sorting Options**: Sort by featured, price, newest, rating
- **Product Details**: Comprehensive product information with images
- **Customer Reviews**: Product ratings and reviews
- **Responsive Design**: Mobile-first approach, works on all devices

### UI/UX Features
- **Sticky Navigation**: Easy access to menu and cart
- **Announcement Bar**: Promotional messages
- **Toast Notifications**: Real-time feedback for user actions
- **Smooth Animations**: Elegant transitions and effects
- **Loading States**: Proper feedback during operations

## 🎨 Design

### Color Scheme
- **Primary Color**: Bright Pink (#E91E63)
- **Secondary Color**: Light Pink (#FCE4EC)
- **Accent Color**: Rose Pink (#F48FB1)
- **Background**: White (#FFFFFF)
- **Text**: Dark Gray (#333333)

### Typography
- **Headings**: Playfair Display (serif) - elegant and luxurious
- **Body**: Poppins (sans-serif) - clean and readable

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Navbar.css
│   ├── Footer.jsx
│   ├── Footer.css
│   ├── ProductCard.jsx
│   ├── ProductCard.css
│   ├── HeroSection.jsx
│   ├── HeroSection.css
│   ├── CategorySection.jsx
│   └── CategorySection.css
├── pages/
│   ├── Home.jsx
│   ├── Home.css
│   ├── Shop.jsx
│   ├── Shop.css
│   ├── ProductDetails.jsx
│   ├── ProductDetails.css
│   ├── Cart.jsx
│   ├── Cart.css
│   ├── Checkout.jsx
│   ├── Checkout.css
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Auth.css
│   ├── Account.jsx
│   ├── Account.css
│   ├── Wishlist.jsx
│   ├── Wishlist.css
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Info.css
│   ├── OrderSuccess.jsx
│   └── OrderSuccess.css
├── context/
│   ├── CartContext.jsx
│   ├── WishlistContext.jsx
│   └── AuthContext.jsx
├── data/
│   └── products.js
├── App.jsx
├── index.css
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory**
   ```bash
   cd reshi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📦 Dependencies

### Main Dependencies
- **react**: ^18.2.0 - UI library
- **react-dom**: ^18.2.0 - React DOM rendering
- **react-router-dom**: ^6.20.0 - Client-side routing
- **bootstrap**: ^5.3.2 - CSS framework
- **bootstrap-icons**: ^1.11.3 - Icon library

### Dev Dependencies
- **vite**: ^5.0.8 - Build tool
- **@vitejs/plugin-react**: ^4.2.1 - React plugin for Vite

## 🗂️ Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| / | Home | Landing page with featured products |
| /shop | Shop | Product listing with filters |
| /product/:id | ProductDetails | Detailed product view |
| /cart | Cart | Shopping cart |
| /checkout | Checkout | Order checkout process |
| /login | Login | User login page |
| /register | Register | User registration page |
| /account | Account | User account dashboard |
| /wishlist | Wishlist | Saved items |
| /about | About | About ReShi Elegance |
| /contact | Contact | Contact form |
| /order-success | OrderSuccess | Order confirmation |

## 🎯 Context API

### CartContext
Manages shopping cart state:
- `addToCart(product, quantity)`
- `removeFromCart(productId)`
- `updateQuantity(productId, quantity)`
- `clearCart()`
- `getTotalItems()`
- `getTotalPrice()`

### WishlistContext
Manages wishlist state:
- `addToWishlist(product)`
- `removeFromWishlist(productId)`
- `toggleWishlist(product)`
- `isInWishlist(productId)`

### AuthContext
Manages authentication state:
- `login(email, password)`
- `register(email, password, name)`
- `logout()`
- `updateProfile(updates)`
- `user` - Current user object
- `isAuthenticated` - Authentication status

## 💾 Local Storage

The application uses browser's localStorage for persistence:
- **cart** - Shopping cart items
- **wishlist** - Wishlist items
- **user** - User authentication data
- **isAdmin** - Admin status

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px

## 🎨 Customization

### Colors
Edit the CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #E91E63;
  --secondary-color: #FCE4EC;
  --accent-color: #F48FB1;
  /* ... */
}
```

### Fonts
Update Google Fonts link in `index.html` to use different fonts.

### Products
Modify sample products in `src/data/products.js`:
```javascript
export const products = [
  {
    id: 1,
    name: 'Product Name',
    price: 5999,
    // ... more properties
  },
  // ... more products
];
```

## 🔐 Security Notes

This is a demonstration project using mock authentication. For production:
- Implement proper backend authentication
- Use secure payment gateway (Razorpay, Stripe, etc.)
- Add HTTPS/SSL
- Validate all inputs on server-side
- Use environment variables for sensitive data

## 📝 Sample Products

The project includes 10 sample sarees:
1. Pink Banarasi Silk Saree
2. Lavender Organza Saree
3. Yellow Embroidered Saree
4. Green Kanjivaram Saree
5. Peach Cotton Silk Saree
6. Maroon Bridal Saree
7. Blue Party Wear Saree
8. Ivory Designer Wedding Saree
9. Red Traditional Saree
10. White Cotton Saree

## 🎯 Future Enhancements

- [ ] Admin dashboard for product management
- [ ] Real payment gateway integration
- [ ] Product reviews and ratings system
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Inventory management
- [ ] Multi-language support
- [ ] Live chat support

## 📄 License

This project is created for educational and commercial purposes.

## 👥 Support

For support, email: hello@reshielegance.com

---

**Made with ❤️ for ReShi Elegance**

*Grace in every weave, elegance in every drape.*

## Backend Setup

The product admin API now supports Supabase on the backend. If the Supabase env vars are present, the server uses the `products` table; otherwise it falls back to the local in-memory store until you wire the new database.

Start the backend with:

```bash
cd server
npm run dev
```

Start the frontend with:

```bash
npm run dev
```

### Supabase

Copy `server/.env.example` to `server/.env` and fill in:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PRODUCTS_TABLE=products
SUPABASE_STORAGE_BUCKET=products
```

For the frontend, add these Vite env variables to `.env.local`:

```env
VITE_SUPABASE_URL=https://pmodtbszagqjbeskusms.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

Create a `products` table with the columns used by the API:

- `id` text or uuid primary key
- `name` text
- `price` numeric
- `stock` integer
- `description` text
- `image` text
- `status` text
- `createdAt` timestamptz or text
- `updatedAt` timestamptz or text

For storage uploads, make the `products` bucket public or adjust the bucket name to match your Supabase storage setup.
