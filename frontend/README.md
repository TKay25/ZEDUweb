# ZEDU Frontend - Bootstrap JavaScript

A responsive educational platform frontend built with Bootstrap 5 and vanilla JavaScript.

## Features

- **Responsive Design**: Mobile-first design with Bootstrap 5
- **Authentication**: Login and registration system
- **Dashboard**: Personalized user dashboard
- **Course Browsing**: Browse and enroll in courses
- **Tutor Finder**: Find and book tutors
- **Messaging**: Real-time messaging system
- **Performance Tracking**: View assessments and performance metrics
- **AI Tools**: Access AI-powered features
- **Vanilla JavaScript**: No frameworks - pure JS

## Tech Stack

- **Frontend Framework**: None (Vanilla JavaScript)
- **CSS Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **HTTP Client**: Fetch API
- **Storage**: LocalStorage

## Installation

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python or Node.js (for local server)
- No build process required!

### Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Serve files locally**
   
   Using Python:
   ```bash
   python -m http.server 3000
   ```
   
   Or using Node.js with http-server:
   ```bash
   npx http-server -p 3000
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## File Structure

```
frontend/
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # User dashboard
├── courses.html            # Courses browsing
├── tutors.html             # Tutors directory
├── profile.html            # User profile (template)
├── settings.html           # User settings (template)
├── css/
│   └── styles.css          # Custom styling
└── js/
    ├── api-client.js       # API communication
    ├── utils.js            # Utility functions
    ├── auth.js             # Authentication logic
    ├── dashboard.js        # Dashboard functionality
    ├── courses.js          # Courses page logic
    └── tutors.js           # Tutors page logic
```

## Pages

- **Home (index.html)**: Landing page with features and stats
- **Login**: User authentication
- **Register**: New account creation
- **Dashboard**: User home with statistics and recent activity
- **Courses**: Browse available courses with filters
- **Tutors**: Find and view tutor profiles
- **Profile**: User profile management (template)
- **Settings**: Account settings (template)

## API Integration

The frontend communicates with the Flask backend via REST API.

### API Client Usage

```javascript
// Login
const response = await apiClient.login(email, password);

// Get current user
const user = await apiClient.getCurrentUser();

// List courses
const courses = await apiClient.listCourses(page, perPage, filters);

// Enroll in course
await apiClient.enrollCourse(courseId);

// Send message
await apiClient.sendMessage(recipientId, content);
```

## Key Features

### Authentication
- JWT token-based authentication
- Token storage in localStorage
- Auto-logout on token expiration
- Protected routes

### Course Management
- Browse courses with filters
- View course details and lessons
- Enroll in courses
- Track progress

### Tutor System
- Search tutors by specialization
- View tutor profiles and ratings
- Check availability
- Book sessions

### Dashboard
- Welcome message with user's name
- Statistics cards (courses, study hours, GPA, performance)
- Recent activity feed
- Quick navigation

### Messaging
- Send messages to other users
- View inbox and sent messages
- Conversation view

### Responsive Design
- Mobile-friendly interface
- Works on all screen sizes
- Touch-friendly buttons and forms
- Collapsible navigation

## Utilities

### API Client (api-client.js)
- Centralized API communication
- Automatic token management
- Error handling
- Request/response formatting

### Utils (utils.js)
- Storage management
- Toast notifications
- Date formatting
- Validation functions
- DOM manipulation helpers

### Formatters
- Date/DateTime formatting
- Currency formatting
- Rating display
- Percentage display

### Validators
- Email validation
- Password strength
- Phone number validation
- URL validation

## Styling

Custom CSS includes:
- Global styles and variables
- Component styling (cards, buttons, forms)
- Responsive layout
- Dark mode ready
- Custom scrollbars
- Loading animations
- Toast notifications

## Customization

### Change API URL
Edit `js/api-client.js`:
```javascript
const API_BASE_URL = 'http://your-api-url/api';
```

### Modify Styling
Edit `css/styles.css` or override variables:
```css
:root {
    --primary-color: #0d6efd;
    --secondary-color: #6c757d;
    /* ... */
}
```

### Add New Pages
1. Create HTML file in frontend directory
2. Import necessary JS files
3. Create corresponding JS functions
4. Add navigation links

## Development

### Adding New Features

1. **Create API endpoint in backend**
   ```python
   @app.route('/api/new-endpoint', methods=['POST'])
   def new_endpoint():
       # Implementation
   ```

2. **Add API client method**
   ```javascript
   async newEndpoint(data) {
       return this.post('/new-endpoint', data);
   }
   ```

3. **Create HTML elements and JavaScript handlers**
   ```javascript
   async function handleNewFeature() {
       const result = await apiClient.newEndpoint(data);
       Toast.success('Success!');
   }
   ```

### Testing

Use browser DevTools:
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Use Application tab to view localStorage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliant
- Form validation messages

## Performance

- No build step required
- Minimal dependencies
- Efficient DOM manipulation
- Debounced search
- Lazy loading (where applicable)
- CSS and JS caching

## Deployment

### Simple Deployment

1. **Build with backend**
   - Serve frontend files from backend static folder
   - Configure CORS if serving separately

2. **Docker**
   ```bash
   docker build -t zedu-frontend .
   docker run -p 3000:3000 zedu-frontend
   ```

3. **Static Hosting**
   - Upload to GitHub Pages, Netlify, or Vercel
   - Update API_BASE_URL for production

### Environment Configuration

For production, update `js/api-client.js`:
```javascript
const API_BASE_URL = process.env.API_URL || 'https://api.zedu.com/api';
```

## Troubleshooting

**CORS Errors**
- Ensure backend has CORS enabled
- Check API_BASE_URL is correct

**Token Issues**
- Clear localStorage: `localStorage.clear()`
- Login again

**Page Not Loading**
- Check browser console for errors
- Verify all JS files are loaded
- Check API connectivity

**Styling Issues**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check CSS file is loaded

## Contributing

To contribute:
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - see LICENSE file for details
