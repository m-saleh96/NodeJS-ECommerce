e-commerce application built using NodeJS, Express, and MongoDB.

Features:
-Stripe Integration: Stripe has been integrated to handle payment processing, providing customers with a seamless checkout experience.
-Nodemailer: It sends OTP for sign-up or password reset.
-Randomstring Library: Used to generate OTP.
-Validation: The API is equipped with robust validation to ensure the accuracy and integrity of the received data.
-Authentication: The API includes a secure authentication system, allowing users to log in with their credentials and access protected routes.
-Authorization: Take control of access! The API supports role-based authorization, allowing you to restrict certain routes to specific user roles, ensuring top-notch security.
-Multer: Media uploads are a breeze, making your store visually appealing and user-friendly.

Flow of the application:
-Users can browse products, check ratings, and add reviews. However, before placing an order, they need to log in. Payment can be made using Visa, and after a successful payment, they will receive an email confirming their order.

-Admins can add categories, products, and appoint other admins using their email addresses. They can also control the status of products, marking them as 'out for delivery,' 'delivered,' or 'rejected.'
