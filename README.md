# FakeStore Mobile Shop

Simple React Native / Expo mobile shop app built for exam.  
It uses the FakeStore API for products and users, supports authentication, cart with persistence, and a profile screen with avatar upload.

---

## Features

### 🧑‍💻 Authentication

- Login with **username + password**
- Registration form (creates user on FakeStore API)
- Validation using **react-hook-form + Yup**
- **"Remember me"** checkbox:
  - If checked → token + user are saved in AsyncStorage
  - If not checked → data is kept only in memory

### 🛒 Products & Cart

- Products list page with:
  - Product image, title, price, category and rating
- Product details page:
  - Bigger image, full description, rating, Add to cart button
- Cart page:
  - Add / remove items
  - Increase / decrease quantity
  - Shows subtotal
  - Cart data stored in **AsyncStorage**, so it survives app reload

### 👤 Profile

- Shows logged-in FakeStore user:
  - Username, name, email, phone, address
- Logout button
- Registration modal to create new account
- Uses global `AuthContext` for auth state

### 🖼 Avatar + Permissions (expo-image-picker)

- On the Profile screen, the user can:
  - Tap **“Change photo”**
  - App requests **media library permission**
  - User picks an image from gallery
  - Avatar is displayed as a round profile picture
  - Avatar is stored in AsyncStorage (only when "Remember me" is enabled)

This satisfies the requirement of using **one library that needs permissions**.

---

## Tech Stack

- [Expo](https://expo.dev/)
- React Native
- TypeScript
- [expo-router](https://expo.github.io/router/)
- `react-hook-form`
- `yup` + `@hookform/resolvers`
- `@react-native-async-storage/async-storage`
- `expo-image-picker`
- FakeStore API (`https://fakestoreapi.com`)

---

## Project Structure (short)

```text
app/
  index.tsx             # Home / products list
  _layout.tsx           # Layout with header/footer and providers
  cart.tsx              # Cart screen
  profile/
    profile.tsx         # Decides: LoggedInView vs LoginForm + RegisterModal
    LoggedInView.tsx    # Profile info + avatar + logout
    LoginForm.tsx       # Login form, remember me, validation
    RegisterModal.tsx   # Registration modal form
  product/
    [id].tsx            # Product details screen

store/
  authContext.tsx       # Auth + remember me + avatar + AsyncStorage
  cartcpntexst.tsx      # Cart context + AsyncStorage
```
