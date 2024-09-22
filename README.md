URL Manager with Next.js and Additional Features

This is a URL Manager application built with the Next.js stack (Next.js , Prisma, Supabase, Kafka, Redis, Nextauth, Tailwind) offering advanced functionalities beyond basic URL shortening.

Core Features:

    Shorten URLs: Convert long URLs into shorter, manageable links.
    Redirection: Clicking the shortened URL instantly redirects to the original long URL.
    User Authentication: Securely manage shortened URLs via user accounts.
    User Dashboard: View, edit, delete, and track analytics for your shortened URLs.
    Error Handling: Gracefully handle invalid URLs, server errors, and edge cases.
    Security: Implement best practices for secure authentication and data handling.

Additional Features:

    Kafka Message Queue: Send asynchronous emails using a message queue for improved performance.
    Redis Cache: Cache frequently used URLs for faster response times.
    Next.js Integration: Leverage Next.js for server-side rendering and improved SEO.
    Analytics: Track the number of clicks and other relevant metrics for each shortened URL.

Deployment:

The application is deployed at https://mjkm.vercel.app.

Documentation:

    This README provides a brief overview of the application.
    For detailed information, refer to the code repository, available upon request.

Contribution:

This application is open-source. Feel free to contribute to its development!

Further Enhancements:

    Implement more advanced analytics.
    Integrate custom domain functionality.
    Add social sharing features.

Advanced Backend Funtionalities:

    Implemented Rate limiting and request throttling using Redis
    Implemented Redis for proper caching of urls for faster response time
    Implemented Kafka Message Queue for sending emails and seperating non critical tasks.

For your Convinience, Use these credentials to directly start Testing the application.

    jamikhan8439@gmail.com
    12341234
