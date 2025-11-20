import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { 
  Mail, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from "lucide-react"
import { contactEnquiriesService } from "~/services/contactEnquiriesService"
import type { ContactEnquiryStats } from "~/types/contact-enquiry"

export function ContactEnquiriesStatsCard() {
  const [stats, setStats] = useState<ContactEnquiryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await contactEnquiriesService.getStats()
        if (response.success) {
          setStats(response.data)
        }
      } catch (error) {
        console.error("Error fetching contact enquiry stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Enquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Enquiries
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {stats.byStatus.new}
            </div>
            <div className="text-sm text-gray-600 mt-1">New</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">By Status</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                In Progress
              </span>
              <Badge variant="secondary">{stats.byStatus.inProgress}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Contacted
              </span>
              <Badge variant="secondary">{stats.byStatus.contacted}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Resolved
              </span>
              <Badge variant="secondary">{stats.byStatus.resolved}</Badge>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        {stats.byPriority.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">By Priority</div>
            <div className="space-y-2 text-sm">
              {stats.byPriority.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <span className="capitalize">{item._id}</span>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Enquiries */}
        {stats.recentEnquiries && stats.recentEnquiries.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Recent</div>
            <div className="space-y-2">
              {stats.recentEnquiries.slice(0, 3).map((enquiry) => (
                <div
                  key={enquiry._id}
                  className="text-sm p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">
                    {enquiry.firstName} {enquiry.lastName}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {enquiry.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        <Link to="/enquiries/contact">
          <Button variant="outline" className="w-full">
            View All Enquiries
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
