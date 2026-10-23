# E-Shop Backend API Documentation

**Repository:** https://github.com/mahmoud-190-0/E-Shop  
**Stack:** Node.js, Express, MongoDB/Mongoose, JWT, Stripe  
**API prefix:** `/api/v1`

> This document is based on the route definitions in the repository. Request-body fields and response payloads can vary by controller/validator, so check the linked route/controller/validator files before assuming a field name. Do not expose secrets from `.env`.

## 1. Local setup

Set the frontend environment variable:

env
VITE_API_URL=http://localhost:5000/api/v1


Example Axios client:

js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add a JWT only when one exists.
// Change "token" to the actual storage key used by the frontend auth flow.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;


The backend CORS configuration currently allows `http://localhost:5173`. If Vite starts on another port, update the backend CORS origin to match it.

## 2. Authentication

- Register: `POST /auth/signup`
- Login: `POST /auth/login`
- Forgot password: `POST /auth/forgotPassword`
- Verify reset code: `POST /auth/verifyResetCode`
- Resend reset code: `POST /auth/resendResetCode`
- Reset password: `PUT /auth/resetPassword`

For protected endpoints, send:

http
Authorization: Bearer <JWT_TOKEN>


Role restrictions are applied to certain endpoints:
- `user`: customer account
- `admin`: administrator
- `manager`: manager

Do not assume every logged-in user can access every protected endpoint. Respect the role requirements listed below.

## 3. Endpoints

All paths below are relative to `/api/v1`.

### Authentication — `/auth`

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | Public | Create a customer account |
| POST | `/auth/login` | Public | Log in |
| POST | `/auth/forgotPassword` | Public | Request password-reset code |
| POST | `/auth/verifyResetCode` | Public | Verify reset code |
| POST | `/auth/resendResetCode` | Public | Resend reset code |
| PUT | `/auth/resetPassword` | Public | Set a new password after verification |

**Reference:** `routes/authRoute.js`, `controllers/authController.js`, `utils/Validators/authValidator.js`

### Products — `/products`

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/products` | Public | List/filter products |
| POST | `/products` | Admin/manager | Create product |
| GET | `/products/:id` | Public | Get one product |
| PUT | `/products/:id` | Admin/manager | Update product |
| DELETE | `/products/:id` | Admin/manager | Delete product |
| GET | `/products/:productId/reviews` | Public | List reviews for a product |
| POST | `/products/:productId/reviews` | User | Create review for a product |

Product list supports query filtering through the backend's `ApiFeatures` and product filter logic. Check `utils/ApiFeatures.js` and `controllers/productController.js` for the supported query parameters and exact response shape.

Product create/update can include image upload. Inspect `routes/productRoute.js` and `Middleware/uploadImageMiddleware.js` for the accepted multipart field name.

**Reference:** `routes/productRoute.js`, `controllers/productController.js`, `utils/Validators/productValidator.js`

### Categories — `/categories`

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/categories` | Public | List categories |
| POST | `/categories` | Admin/manager | Create category |
| GET | `/categories/:id` | Public | Get one category |
| PUT | `/categories/:id` | Admin/manager | Update category |
| DELETE | `/categories/:id` | Admin/manager | Delete category |
| GET | `/categories/:categoryId/subcategories` | Public | List subcategories belonging to a category |
| POST | `/categories/:categoryId/subcategories` | Admin/manager | Create subcategory for a category |

Category create/update can include image upload.

**Reference:** `routes/categoryRoute.js`, `routes/subCategoriesRoute.js`, `controllers/categoryController.js`, `controllers/subCategoryController.js`

### Subcategories — `/subcategories`

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/subcategories` | Public | List/filter subcategories |
| POST | `/subcategories` | Admin/manager | Create subcategory |
| GET | `/subcategories/:id` | Public | Get one subcategory |
| PUT | `/subcategories/:id` | Admin/manager | Update subcategory |
| DELETE | `/subcategories/:id` | Admin/manager | Delete subcategory |
| GET | `/subcategories/:subcategoryId/products` | Public | List products for a subcategory |
| POST | `/subcategories/:subcategoryId/products` | Admin/manager | Create product assigned to that subcategory |
| GET | `/subcategories/:subcategoryId/products/:id` | Public | Get a product in the nested product router |

The nested product router also defines `PUT` and `DELETE` on `/:id` with admin/manager access. Confirm the nested URL behavior against the current route mounting before relying on it.

**Reference:** `routes/subCategoriesRoute.js`, `routes/productRoute.js`

### Brands — `/brands`

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/brands` | Public | List brands |
| POST | `/brands` | Admin/manager | Create brand |
| GET | `/brands/:id` | Public | Get one brand |
| PUT | `/brands/:id` | Admin/manager | Update brand |
| DELETE | `/brands/:id` | Admin/manager | Delete brand |

Brand create/update can include image upload.

**Reference:** `routes/brandsRoute.js`, `controllers/brandController.js`, `utils/Validators/brandValidator.js`

### Reviews — `/reviews`

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/reviews` | Public | List/filter reviews |
| POST | `/reviews` | User | Create review (route expects product context when nested) |
| GET | `/reviews/:id` | Public | Get one review |
| PUT | `/reviews/:id` | User | Update review |
| DELETE | `/reviews/:id` | User/admin/manager | Delete review |

The router is mounted both at `/reviews` and nested under `/products/:productId/reviews`. The controller sets product/user context for nested review creation. Confirm the expected body fields in `utils/Validators/reviewValidator.js`.

**Reference:** `routes/reviewRoute.js`, `controllers/reviewController.js`

### Cart — `/cart` (authenticated customer)

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/cart` | User | Get current user's cart |
| POST | `/cart` | User | Add product to cart |
| PATCH | `/cart/:productId` | User | Update product quantity |
| DELETE | `/cart/:productId` | User | Remove product from cart |
| DELETE | `/cart` | User | Clear cart |
| PUT | `/cart/applyCoupon` | User | Apply coupon to cart |
| DELETE | `/cart/removeCoupon` | User | Remove applied coupon |

**Reference:** `routes/cartRoute.js`, `controllers/cartController.js`, `utils/Validators/cartAndCouponValidator.js`

### Wishlist — `/wishlist` (authenticated customer)

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/wishlist` | User | Get current user's wishlist |
| POST | `/wishlist/:productId` | User | Add product to wishlist |
| DELETE | `/wishlist/:productId` | User | Remove product from wishlist |
| DELETE | `/wishlist` | User | Clear wishlist |

**Reference:** `routes/wishlistRoute.js`, `controllers/wishlistController.js`

### Addresses — `/addresses` (authenticated)

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/addresses` | Authenticated | List current user's addresses |
| POST | `/addresses` | Authenticated | Add address |
| PUT | `/addresses/:addressId` | Authenticated | Update address |
| DELETE | `/addresses/:addressId` | Authenticated | Remove address |

**Reference:** `routes/addressRoute.js`, `controllers/addressController.js`, `utils/Validators/addressValidator.js`

### Coupons — `/coupons` (admin only)

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/coupons` | Admin | List coupons |
| POST | `/coupons` | Admin | Create coupon |
| GET | `/coupons/:id` | Admin | Get one coupon |
| PUT | `/coupons/:id` | Admin | Update coupon |
| DELETE | `/coupons/:id` | Admin | Delete coupon |

Customers apply a coupon to their cart through `PUT /cart/applyCoupon`, not through the admin coupon-management endpoints.

**Reference:** `routes/couponRoute.js`, `controllers/couponController.js`

### Orders — `/orders`

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/orders` | User/admin/manager | Get orders (scope depends on role/controller) |
| POST | `/orders` | User | Create cash order |
| GET | `/orders/:id` | User/admin/manager | Get one order |
| PUT | `/orders/:id/status` | Admin/manager | Update order status |
| PUT | `/orders/:id/cancel` | User | Cancel own order |
| GET | `/orders/checkout-session/:cartId` | User | Create Stripe checkout session |
| POST | `/orders/webhook` | Stripe webhook | Stripe checkout event callback; not a normal frontend API call |

**Reference:** `routes/orderRoute.js`, `controllers/orderController.js`, `config/stripe.js`

Do not call the webhook endpoint directly from the frontend. Stripe calls it server-to-server.

### Users — `/users`

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/users/getMe` | Authenticated | Get current user's profile |
| PUT | `/users/updateMe` | Authenticated | Update current user's profile |
| PUT | `/users/changeMyPassword` | Authenticated | Change own password |
| DELETE | `/users/DeleteMe` | Authenticated | Deactivate own account |
| GET | `/users` | Admin | List users |
| POST | `/users` | Admin | Create user |
| GET | `/users/:id` | Admin | Get one user |
| PUT | `/users/:id` | Admin | Update user |
| PUT | `/users/changePassword/:id` | Admin | Change a user's password |
| PUT | `/users/activate/:id` | Admin | Activate user |
| DELETE | `/users/deactivate/:id` | Admin | Deactivate user |

**Reference:** `routes/userRoute.js`, `controllers/userController.js`, `utils/Validators/userValidator.js`

## 4. Query parameters, request bodies, and image uploads

- Use the exact query parameters supported by `utils/ApiFeatures.js` and each resource's filter function. Do not assume every resource supports pagination, sorting, or every filter.
- JSON requests should use `Content-Type: application/json`.
- For image uploads, use `FormData` / `multipart/form-data` and the exact field names accepted by each upload middleware. Avoid manually setting the multipart boundary.
- IDs in URL paths must be valid database IDs expected by the API.
- Check validators for required fields and accepted values before wiring forms.

## 5. Error handling

The API uses a global error middleware. Frontend code should:
- Handle non-2xx HTTP responses.
- Show validation messages returned by the API when available.
- Provide loading, empty, success, and error states.
- Handle `401` by updating authentication state / asking the user to log in.
- Handle `403` as insufficient permission.
- Avoid assuming all error responses have the same shape without checking `Middleware/errorMidleware.js`.

## 6. Integration checklist

- [ ] Configure `VITE_API_URL`.
- [ ] Confirm backend is running and reachable.
- [ ] Confirm frontend origin matches backend CORS configuration.
- [ ] Implement a shared Axios client.
- [ ] Confirm the actual login response and where the JWT is returned.
- [ ] Store and attach the token consistently for protected endpoints.
- [ ] Match form fields to validators and controllers.
- [ ] Confirm response data paths before rendering (`response.data`, nested `data`, etc.).
- [ ] Test customer and admin/manager flows separately.
- [ ] Verify product/category images load correctly.
- [ ] Test loading, empty, validation, unauthorized, and server-error states.

## 7. Source files

- `app.js` — route prefixes, CORS, middleware
- `routes/` — HTTP methods and endpoint paths
- `controllers/` — request handling and response shape
- `utils/Validators/` — accepted fields and validation rules
- `utils/ApiFeatures.js` — query filtering, sorting, pagination
- `Middleware/errorMidleware.js` — error response format
- `Middleware/uploadImageMiddleware.js` — upload field/configuration
