# ReWear - Sustainable Fashion Exchange Platform

ReWear is a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## Features

### User Authentication
- Email/password signup and login
- Demo accounts for testing (User and Admin)
- Session management with localStorage

### Landing Page
- Platform introduction with sustainable fashion messaging
- Call-to-action buttons: "Start Swapping", "Browse Items", "List an Item"
- Featured items carousel
- Statistics showcase
- How it works section

### User Dashboard
- Profile details and points balance
- Uploaded items overview with status indicators
- Ongoing and completed swaps list
- Recent activity feed
- Quick actions for managing items

### Browse Items
- Grid and list view options
- Advanced filtering by category, size, condition
- Search functionality
- Sorting options (newest, oldest, points)
- Responsive design for all devices

### Item Detail Page
- Image gallery with navigation
- Full item description and specifications
- Uploader information
- Swap request and points redemption options
- Similar items recommendations
- Points balance display

### Add New Item
- Image upload (up to 4 photos)
- Comprehensive form with all required fields
- Tag system for better discoverability
- Points value suggestions based on condition
- Form validation and error handling

### Admin Panel
- Moderate and approve/reject item listings
- Remove inappropriate or spam items
- View platform statistics
- Monitor swap requests
- Lightweight admin interface

## Technology Stack

- **Frontend Framework**: Angular 19 (Standalone Components)
- **Styling**: Tailwind CSS
- **State Management**: RxJS BehaviorSubject
- **Routing**: Angular Router with lazy loading
- **Forms**: Angular Reactive Forms and Template-driven forms
- **Icons**: Heroicons (SVG)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reWear
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Demo Accounts

For testing purposes, you can use these demo accounts:

**Regular User:**
- Email: `user@rewear.com`
- Password: `demo123`

**Admin User:**
- Email: `admin@rewear.com`
- Password: `demo123`

## Project Structure

```
src/
├── app/
│   ├── models/           # TypeScript interfaces
│   ├── services/         # Business logic and data management
│   ├── pages/           # Main application pages
│   │   ├── landing/     # Landing page
│   │   ├── auth/        # Login and registration
│   │   ├── dashboard/   # User dashboard
│   │   ├── browse/      # Item browsing
│   │   ├── item-detail/ # Individual item view
│   │   ├── add-item/    # Add new item form
│   │   └── admin/       # Admin panel
│   └── components/      # Reusable components
├── styles.css           # Global styles with Tailwind
└── main.ts             # Application entry point
```

## Key Features Implementation

### Points System
- Users earn points by listing items
- Points can be used to redeem items
- Points balance is tracked per user
- Suggested point values based on item condition

### Swap System
- Users can request swaps for items
- Swap requests can be accepted/rejected
- Status tracking for all swap requests
- Notification system for swap updates

### Image Management
- Support for multiple images per item
- Image gallery with navigation
- Thumbnail preview system
- Responsive image display

### Admin Moderation
- Item approval workflow
- Content moderation tools
- Platform statistics dashboard
- User management capabilities

## Styling and Design

The application uses Tailwind CSS for styling with a custom design system:

- **Primary Colors**: Blue gradient theme
- **Secondary Colors**: Purple accent colors
- **Components**: Custom button styles, cards, and form elements
- **Responsive**: Mobile-first design approach
- **Accessibility**: ARIA labels and semantic HTML

## Future Enhancements

- Real-time notifications
- Chat system for users
- Advanced search with filters
- User reviews and ratings
- Mobile app development
- Integration with payment systems
- Analytics dashboard
- Email notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository or contact the development team.
