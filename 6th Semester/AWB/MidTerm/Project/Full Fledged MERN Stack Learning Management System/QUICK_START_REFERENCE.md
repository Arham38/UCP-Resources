# 🚀 QUICK START REFERENCE - COMPONENT API

> **Copy-paste ready examples for all 11 modern components**

---

## 📦 IMPORT PATHS

```javascript
// Buttons & Inputs
import Button from './components/Button-Modern';
import FormInput from './components/FormInput-Modern';

// Layouts
import Navbar from './components/Navbar-Modern';
import Footer from './components/Footer-Modern';

// Cards & Display
import CourseCard from './components/CourseCard-Modern';
import StatsCard from './components/StatsCard-Modern';
import DashboardCard from './components/DashboardCard-Modern';

// Sections
import HeroSection from './components/HeroSection-Modern';
import FeaturesSection from './components/FeaturesSection-Modern';

// Dialogs
import Modal from './components/Modal-Modern';

// Pages
import Home from './pages/Home-Modern';
import Courses from './pages/Courses-Modern';
```

---

## 🎨 COMPONENT QUICK REFERENCE

### Button Component

```javascript
/* BASIC USAGE */
<Button>Click Me</Button>

/* WITH VARIANTS */
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>

/* WITH SIZES */
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>        {/* Default */}
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

/* WITH LOADING STATE */
<Button loading>Processing...</Button>

/* WITH DISABLED STATE */
<Button disabled>Disabled</Button>

/* WITH ICON */
<Button icon={CheckIcon}>Approve</Button>
<Button icon={TrashIcon} iconPosition="right">Delete</Button>

/* COMBINING VARIANTS */
<Button 
  variant="primary" 
  size="lg" 
  icon={ArrowRightIcon}
  iconPosition="right"
>
  Get Started
</Button>
```

---

### FormInput Component

```javascript
/* BASIC TEXT INPUT */
<FormInput 
  label="Full Name"
  name="fullName"
  placeholder="John Doe"
/>

/* WITH VALIDATION ERROR */
<FormInput 
  label="Email"
  type="email"
  name="email"
  error="Invalid email address"
/>

/* WITH SUCCESS STATE */
<FormInput 
  label="Password"
  type="password"
  name="password"
  success={true}
/>

/* WITH HELP TEXT */
<FormInput 
  label="Username"
  name="username"
  helpText="3-20 characters, letters and numbers only"
/>

/* WITH ICON */
<FormInput 
  label="Search"
  name="search"
  icon={SearchIcon}
  placeholder="Search courses..."
/>

/* REQUIRED FIELD */
<FormInput 
  label="Course Title"
  name="title"
  required
/>

/* DISABLED STATE */
<FormInput 
  label="Admin Only"
  value="Cannot edit"
  disabled
/>

/* LARGE SIZE */
<FormInput 
  label="Description"
  name="description"
  type="textarea"
  size="lg"
  placeholder="Describe your course..."
/>
```

---

### Modal Component

```javascript
const [isOpen, setIsOpen] = useState(false);

/* BASIC MODAL */
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
>
  <p>Are you sure? This cannot be undone.</p>
</Modal>

/* WITH FOOTER */
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </>
  }
>
  <p>Please confirm this action.</p>
</Modal>

/* DIFFERENT SIZES */
<Modal size="sm">Small Modal</Modal>          {/* 384px max */}
<Modal size="md">Medium Modal</Modal>        {/* 448px max - Default */}
<Modal size="lg">Large Modal</Modal>         {/* 512px max */}
<Modal size="xl">Extra Large Modal</Modal>   {/* 576px max */}
<Modal size="2xl">2XL Modal</Modal>          {/* 672px max */}

/* WITHOUT CLOSE BUTTON */
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeButton={false}
>
  This modal cannot be closed by clicking X
</Modal>

/* FULL EXAMPLE */
<Modal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  title="Delete Course"
  size="md"
  closeButton={true}
  footer={
    <>
      <button 
        onClick={() => setShowDeleteModal(false)}
        className="px-4 py-2 border rounded-lg"
      >
        Cancel
      </button>
      <button 
        onClick={handleDeleteCourse}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Delete Course
      </button>
    </>
  }
>
  <p>Are you sure you want to delete this course? All enrolled students will be notified.</p>
</Modal>
```

---

### CourseCard Component

```javascript
/* BASIC COURSE CARD */
<CourseCard course={courseData} />

/* WITH ENROLLMENT BUTTON */
<CourseCard
  course={courseData}
  showEnroll={true}
  onEnroll={(course) => handleEnroll(course)}
/>

/* SHOW PROGRESS */
<CourseCard
  course={courseData}
  isEnrolled={true}
  showProgress={true}
  progress={65}
/>

/* INSTRUCTOR ACTION BUTTONS */
<CourseCard
  course={courseData}
  showActions={true}
  onEdit={(course) => openEditModal(course)}
  onDelete={(course) => openDeleteModal(course)}
/>

/* FULL EXAMPLE */
<CourseCard
  course={{
    _id: '123',
    title: 'React Mastery',
    instructor: { name: 'John Doe' },
    image: '/images/react.jpg',
    price: 99.99,
    avgRating: 4.8,
    totalReviews: 156,
    level: 'Intermediate'
  }}
  isEnrolled={false}
  onEnroll={handleEnroll}
  showEnroll={true}
/>
```

---

### StatsCard Component

```javascript
import { UsersIcon, BookOpenIcon, TrendingUpIcon } from '@heroicons/react/solid';

/* BASIC STATS CARD */
<StatsCard
  icon={UsersIcon}
  label="Total Students"
  value="12,543"
/>

/* WITH TREND */
<StatsCard
  icon={TrendingUpIcon}
  label="Revenue"
  value="$45,230"
  trend={{ positive: true, value: 23 }}
/>

/* DIFFERENT COLORS */
<StatsCard label="Indigo" color="indigo" value="100" />
<StatsCard label="Emerald" color="emerald" value="200" />
<StatsCard label="Purple" color="purple" value="300" />
<StatsCard label="Orange" color="orange" value="400" />
<StatsCard label="Rose" color="rose" value="500" />

/* DIFFERENT SIZES */
<StatsCard label="Small" size="sm" value="10" />
<StatsCard label="Medium" size="md" value="100" />
<StatsCard label="Large" size="lg" value="1000" />

/* TRENDING DOWN */
<StatsCard
  icon={ChartDownIcon}
  label="Churn Rate"
  value="3.2%"
  trend={{ positive: false, value: 5 }}
  color="rose"
/>
```

---

### DashboardCard Component

```javascript
/* BASIC CARD */
<DashboardCard
  title="Welcome Back"
  content="You have 3 new course updates"
/>

/* WITH ICON & SUBTITLE */
<DashboardCard
  title="Recent Activity"
  subtitle="Last 7 days"
  icon={ActivityIcon}
  content="45 students completed lessons"
/>

/* WITH FOOTER */
<DashboardCard
  title="Course Progress"
  content="Currently 15 students enrolled"
  footer={
    <button className="text-indigo-600">View All</button>
  }
/>

/* DIFFERENT VARIANTS */
<DashboardCard variant="default">Default</DashboardCard>
<DashboardCard variant="primary">Primary</DashboardCard>
<DashboardCard variant="success">Success</DashboardCard>
<DashboardCard variant="warning">Warning</DashboardCard>

/* CLICKABLE CARD */
<DashboardCard
  title="Go to Dashboard"
  hoverable={true}
  onClick={() => navigate('/admin/dashboard')}
/>

/* FULL EXAMPLE */
<DashboardCard
  title="Top Performer"
  subtitle="This Month"
  icon={StarIcon}
  variant="primary"
  size="lg"
  hoverable={true}
  onClick={() => openStudentProfile('john-doe')}
  content={
    <div>
      <p className="font-semibold">John Doe</p>
      <p className="text-sm text-slate-600">98% course completion</p>
    </div>
  }
  footer={
    <button className="text-sm text-indigo-600">View Profile →</button>
  }
/>
```

---

### Navbar Component

```javascript
/* SIMPLY IMPORT AND USE */
import Navbar from './components/Navbar-Modern';

// Include in your App.jsx
function App() {
  return (
    <>
      <Navbar />
      <main>
        {/* Your content */}
      </main>
    </>
  );
}

/* AUTO FEATURES */
// ✅ Sticky positioning
// ✅ Responsive mobile menu
// ✅ User authentication detection
// ✅ Role-based dashboard routing
// ✅ Notification dropdown
// ✅ Theme toggle
// ✅ Logout functionality
// ✅ Dark mode support
```

---

### Footer Component

```javascript
/* SIMPLY IMPORT AND USE */
import Footer from './components/Footer-Modern';

// Include in your App.jsx
function App() {
  return (
    <>
      <main>
        {/* Your content */}
      </main>
      <Footer />
    </>
  );
}

/* AUTO FEATURES */
// ✅ Newsletter subscription form
// ✅ Multiple footer columns
// ✅ Social media links
// ✅ Legal links
// ✅ Support links
// ✅ Explore links
// ✅ Dark mode support
// ✅ Responsive layout
```

---

### HeroSection Component

```javascript
/* USE IN HOME PAGE */
import HeroSection from './components/HeroSection-Modern';

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* Other sections */}
    </>
  );
}

/* AUTO FEATURES */
// ✅ Animated background
// ✅ Gradient text
// ✅ Stats display
// ✅ CTA buttons
// ✅ Floating cards
// ✅ Trust indicators
// ✅ Fully responsive
// ✅ Dark mode support
```

---

### FeaturesSection Component

```javascript
/* USE IN HOME PAGE */
import FeaturesSection from './components/FeaturesSection-Modern';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      {/* Other sections */}
    </>
  );
}

/* SHOWS 6 FEATURES */
// ✅ Comprehensive Courses
// ✅ Industry Experts
// ✅ Earn Certificates
// ✅ Track Progress
// ✅ Community Support
// ✅ Learn Anywhere
```

---

### Home Page

```javascript
import Home from './pages/Home-Modern';

// Replace your existing home page with:
<Route path="/" element={<Home />} />

/* INCLUDES SECTIONS */
// ✅ Hero with CTA
// ✅ How It Works (4 steps)
// ✅ Featured Courses (4 courses)
// ✅ Testimonials (3 reviews)
// ✅ Final CTA
// ✅ Fully responsive
// ✅ Dark mode support
```

---

### Courses Page

```javascript
import Courses from './pages/Courses-Modern';

// Replace your existing courses page with:
<Route path="/courses" element={<Courses />} />

/* INCLUDES FEATURES */
// ✅ Advanced filtering (level, category, price)
// ✅ Text search
// ✅ Sorting options
// ✅ View mode toggle (grid/list)
// ✅ 12 mock courses
// ✅ Results counter
// ✅ No results state
// ✅ Dark mode support
```

---

## 🎯 INTEGRATION CHECKLIST

- [ ] Copy `design-system.css` to `src/styles/`
- [ ] Import design system in `src/index.css`
- [ ] Update routes to use `-Modern` components
- [ ] Test light and dark modes
- [ ] Test mobile responsiveness
- [ ] Replace components incrementally
- [ ] Update any custom styling conflicts
- [ ] Test all interactive states
- [ ] Verify dark mode toggle works
- [ ] Deploy to staging
- [ ] Get stakeholder approval
- [ ] Deploy to production

---

## 💡 PRO TIPS

1. **Start Small**: Replace one component at a time
2. **Test Dark Mode**: Verify both light and dark modes
3. **Mobile First**: Always test on mobile devices
4. **Accessibility**: Test keyboard navigation
5. **Performance**: Monitor bundle size growth
6. **Customization**: Keep design tokens customizable
7. **Documentation**: Document any customizations
8. **Git Tracking**: Commit changes by component
9. **Staging**: Always test in staging first
10. **Feedback**: Get stakeholder feedback before final push

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile:   < 640px   (sm)
Tablet:   640px - 1024px (md-lg)
Desktop:  > 1024px  (lg+)

Components automatically adapt to screen size
No additional configuration needed
```

---

## 🌙 DARK MODE TOGGLE

```javascript
// Enable dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Disable dark mode
document.documentElement.removeAttribute('data-theme');

// Check current mode
const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
```

---

## 📞 COMMON ISSUES & SOLUTIONS

**Issue**: Styling not applying
**Solution**: Make sure `design-system.css` is imported first

**Issue**: Dark mode not working
**Solution**: Ensure `data-theme="dark"` is set on `<html>` element

**Issue**: Animations stuttering
**Solution**: Check browser hardware acceleration settings

**Issue**: Icons not showing
**Solution**: Install icon library: `npm install @heroicons/react`

---

## 🎓 NEXT STEPS

1. Review this quick reference
2. Test each component individually
3. Integrate into your application
4. Customize colors if needed
5. Deploy with confidence
6. Gather user feedback
7. Iterate and improve

---

**Happy building! 🚀**
