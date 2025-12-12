# Contact Enquiries Management

A comprehensive admin panel feature for managing customer contact form submissions from the Royal Drive Canada website.

## 📋 Overview

This feature allows administrators to:
- View and filter all contact enquiries
- Track enquiry status and priority
- Assign enquiries to team members
- Add internal notes and contact history
- Mark enquiries as resolved
- View detailed statistics and analytics

## 🚀 Features

### 1. **Enquiries List View**
- **Advanced Filtering**: Filter by status, priority, subject, search term
- **Sorting**: Sort by creation date, update date, status, or priority
- **Pagination**: Navigate through large datasets efficiently
- **Quick Actions**: Update status or mark as resolved directly from the list
- **Real-time Stats**: See total counts and breakdowns

### 2. **Enquiry Detail View**
- **Customer Information**: Name, email, phone, subject
- **Message Display**: Full customer message
- **Status & Priority Management**: Update with dropdown selectors
- **Internal Notes**: Add private notes visible only to admins
- **Contact History**: Log all customer interactions (phone, email, SMS, in-person)
- **Timeline**: Track creation, updates, and resolution dates
- **Assignment Tracking**: See who the enquiry is assigned to

### 3. **Statistics Dashboard Card**
- Real-time enquiry counts
- Status breakdown (new, contacted, in-progress, resolved)
- Priority distribution
- Recent enquiries preview
- Quick navigation to full list

## 📁 File Structure

```
app/
├── components/
│   └── enquiries/
│       ├── contact-enquiries-list.tsx          # Main list view with filters
│       ├── contact-enquiry-detail.tsx          # Detailed view with actions
│       └── contact-enquiries-stats-card.tsx    # Dashboard statistics card
├── routes/
│   ├── enquiries.contact.tsx                   # List route
│   └── enquiries.$id.tsx                       # Detail route
├── services/
│   └── contactEnquiriesService.ts              # API service layer
├── types/
│   └── contact-enquiry.ts                      # TypeScript interfaces
└── lib/
    └── api.ts                                  # Enhanced with authenticated API client
```

## 🔌 API Integration

The feature integrates with the backend API at `/api/v1/contact-enquiries`:

### Endpoints Used:
- `GET /contact-enquiries` - List with filters
- `GET /contact-enquiries/stats` - Statistics
- `GET /contact-enquiries/:id` - Single enquiry
- `PUT /contact-enquiries/:id` - Update enquiry
- `POST /contact-enquiries/:id/notes` - Add note
- `POST /contact-enquiries/:id/resolve` - Mark resolved
- `DELETE /contact-enquiries/:id` - Delete (SuperAdmin only)

### Authentication
All admin endpoints require JWT authentication. The API client automatically includes the token from `localStorage.getItem('authToken')`.

## 🎨 UI Components

### Filter Controls
- **Search**: Real-time search across name, email, phone, and message
- **Status Dropdown**: new, contacted, in-progress, resolved, closed
- **Priority Dropdown**: low, medium, high, urgent
- **Subject Dropdown**: General Inquiry, Vehicle Information, Financing Question, etc.
- **Sort Options**: By date, status, or priority

### Status Badges
- **New**: Green badge with alert icon
- **Contacted**: Blue badge with phone icon
- **In Progress**: Yellow badge with clock icon
- **Resolved**: Purple badge with check icon
- **Closed**: Gray badge with check icon

### Priority Badges
- **Low**: Gray background
- **Medium**: Blue background
- **High**: Orange background
- **Urgent**: Red background

## 🔐 Permissions

- **Admin/Manager**: Can view, update, and manage all enquiries
- **SuperAdmin**: Can also delete enquiries

## 📊 Data Types

### ContactEnquiry Interface
```typescript
{
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: ContactSubject
  message: string
  status: EnquiryStatus
  priority: EnquiryPriority
  source: string
  assignedTo?: AssignedUser | null
  notes: EnquiryNote[]
  contactHistory: ContactHistory[]
  resolvedAt?: string | null
  resolvedBy?: ResolvedByUser | null
  createdAt: string
  updatedAt: string
}
```

### Enums
- **ContactSubject**: "General Inquiry", "Vehicle Information", "Financing Question", "Trade-in Valuation", "Service Question"
- **EnquiryStatus**: "new", "contacted", "in-progress", "resolved", "closed"
- **EnquiryPriority**: "low", "medium", "high", "urgent"
- **ContactMethod**: "phone", "email", "in-person", "sms"

## 🧭 Navigation

The feature is accessible via the **Procurement** section in the sidebar:
```
Procurement
├── Contact Enquiries ← NEW
├── Vehicle Enquiries
├── Car Submissions
└── Financing Enquiries
```

## 💡 Usage Examples

### Viewing Enquiries
1. Click "Contact Enquiries" in the Procurement sidebar
2. Use filters to narrow down results
3. Click "View" on any enquiry to see full details

### Managing an Enquiry
1. Open the enquiry detail page
2. Update status using the dropdown (e.g., "New" → "Contacted")
3. Update priority if needed (e.g., "Medium" → "High")
4. Add internal notes to track progress
5. Log contact attempts in Contact History
6. Click "Mark Resolved" when complete

### Adding Notes
Notes are internal and help track:
- Follow-up requirements
- Customer preferences
- Special considerations
- Team coordination

### Logging Contact History
Track all customer interactions:
- **Phone calls**: Log what was discussed
- **Emails**: Note what was sent
- **SMS**: Track text communications
- **In-person**: Record walk-in conversations

## 🎯 Best Practices

1. **Update Status Regularly**: Keep enquiry status current
2. **Set Appropriate Priority**: Use urgent for time-sensitive matters
3. **Add Context in Notes**: Help your team understand the situation
4. **Log All Contacts**: Maintain a complete communication history
5. **Resolve When Done**: Mark enquiries resolved to track completion rates

## 🔄 Future Enhancements

Potential improvements:
- [ ] Email templates for quick responses
- [ ] Bulk actions (assign multiple, update status for many)
- [ ] Advanced analytics and reporting
- [ ] Export enquiries to CSV/Excel
- [ ] Email notifications for new enquiries
- [ ] SLA tracking and alerts
- [ ] Integration with CRM systems
- [ ] Automated assignment based on subject
- [ ] Customer follow-up reminders

## 🐛 Troubleshooting

### Enquiries Not Loading
- Check API base URL in environment variables
- Verify authentication token is valid
- Check browser console for errors

### Updates Not Saving
- Ensure you have proper admin permissions
- Check network tab for failed API calls
- Verify JWT token hasn't expired

### Filters Not Working
- Clear all filters and try again
- Check if search term is too specific
- Verify date ranges are valid

## 🔗 Related Features

- **Vehicle Enquiries**: Customer requests about specific vehicles
- **Financing Enquiries**: Financing application submissions
- **Car Submissions**: Sell-your-car form submissions

## 📞 Support

For technical issues or feature requests, contact the development team.

---

**Last Updated**: November 2025
**Version**: 1.0.0
