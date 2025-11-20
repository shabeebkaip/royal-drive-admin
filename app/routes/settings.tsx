import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import { PageTitle } from "~/components/shared/page-title"
import { 
  Bell, 
  Building2, 
  Clock, 
  Globe, 
  Mail, 
  MapPin, 
  Phone, 
  Share2, 
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Video
} from "lucide-react"
import { settingsService } from "~/services/settingsService"
import type { BusinessSettings, BusinessHour } from "~/types/settings"
import { toast } from "sonner"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("contact")

  // Form states
  const [formData, setFormData] = useState<Partial<BusinessSettings>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await settingsService.getSettings()
      if (response.success) {
        setSettings(response.data)
        setFormData(response.data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneral = async () => {
    try {
      setSaving(true)
      const updates = {
        businessName: formData.businessName,
        tagline: formData.tagline,
        description: formData.description,
        logo: formData.logo,
        favicon: formData.favicon,
        currency: formData.currency,
        timezone: formData.timezone,
        language: formData.language,
      }
      const response = await settingsService.updateSettings(updates)
      if (response.success) {
        setSettings(response.data)
        toast.success("General settings updated successfully")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveContact = async () => {
    try {
      setSaving(true)
      if (formData.contactInfo) {
        await settingsService.updateContactInfo(formData.contactInfo)
        toast.success("Contact information updated successfully")
      }
      if (formData.address) {
        await settingsService.updateAddress(formData.address)
        toast.success("Address updated successfully")
      }
      fetchSettings()
    } catch (error) {
      console.error("Error updating contact:", error)
      toast.error("Failed to update contact information")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSocialMedia = async () => {
    try {
      setSaving(true)
      if (formData.socialMedia) {
        const response = await settingsService.updateSocialMedia(formData.socialMedia)
        if (response.success) {
          toast.success("Social media links updated successfully")
          fetchSettings()
        }
      }
    } catch (error) {
      console.error("Error updating social media:", error)
      toast.error("Failed to update social media links")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBusinessHours = async () => {
    try {
      setSaving(true)
      if (formData.businessHours) {
        const response = await settingsService.updateBusinessHours(formData.businessHours)
        if (response.success) {
          toast.success("Business hours updated successfully")
          fetchSettings()
        }
      }
    } catch (error) {
      console.error("Error updating business hours:", error)
      toast.error("Failed to update business hours")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFeatures = async () => {
    try {
      setSaving(true)
      const updates = {
        features: formData.features,
        emailNotifications: formData.emailNotifications,
        analytics: formData.analytics,
      }
      const response = await settingsService.updateSettings(updates)
      if (response.success) {
        toast.success("Features & settings updated successfully")
        fetchSettings()
      }
    } catch (error) {
      console.error("Error updating features:", error)
      toast.error("Failed to update features")
    } finally {
      setSaving(false)
    }
  }

  const toggleMaintenance = async (enabled: boolean) => {
    try {
      setSaving(true)
      const response = await settingsService.toggleMaintenanceMode({
        enabled,
        message: enabled ? "We're performing scheduled maintenance. We'll be back soon!" : null,
      })
      if (response.success) {
        toast.success(enabled ? "Maintenance mode enabled" : "Maintenance mode disabled")
        fetchSettings()
      }
    } catch (error) {
      console.error("Error toggling maintenance:", error)
      toast.error("Failed to toggle maintenance mode")
    } finally {
      setSaving(false)
    }
  }

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: any) => {
    if (!formData.businessHours) return
    const updated = [...formData.businessHours]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, businessHours: updated })
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title="Business Settings"
        description="Manage your business information and configuration"
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeTab === "contact" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("contact")}
        >
          <Phone className="h-4 w-4 mr-2" />
          Contact & Location
        </Button>
        <Button
          variant={activeTab === "social" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("social")}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Social Media
        </Button>
        <Button
          variant={activeTab === "hours" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("hours")}
        >
          <Clock className="h-4 w-4 mr-2" />
          Business Hours
        </Button>
      </div>

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="grid gap-6">
          <Card className="">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Business Information</CardTitle>
              </div>
              <CardDescription>
                Basic information about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName || ""}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Royal Drive Canada"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline || ""}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Your First Stop for Quality Pre-Owned Vehicles"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Offering safety-certified, dependable pre-owned cars..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={formData.logo || ""}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://cdn.royaldrive.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={formData.favicon || ""}
                    onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                    placeholder="https://cdn.royaldrive.com/favicon.ico"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData.currency || ""}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="CAD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone || ""}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    placeholder="America/Toronto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language || ""}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="en"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="pt-2">
                <Button onClick={handleSaveGeneral} disabled={saving} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Mode */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <CardTitle>Maintenance Mode</CardTitle>
              </div>
              <CardDescription>
                Enable to prevent public access to the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, visitors will see a maintenance message
                  </p>
                </div>
                <Switch
                  checked={formData.maintenanceMode?.enabled || false}
                  onCheckedChange={toggleMaintenance}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact & Location Tab */}
      {activeTab === "contact" && (
        <div className="grid gap-6 ">
          <Card >
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <CardTitle>Contact Information</CardTitle>
              </div>
              <CardDescription>
                Phone numbers and email addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Numbers Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Numbers
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhone" className="flex items-center gap-1">
                      Primary Phone
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="primaryPhone"
                      value={formData.contactInfo?.primaryPhone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo!, primaryPhone: e.target.value },
                        })
                      }
                      placeholder="(647) 622-2202"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                    <Input
                      id="secondaryPhone"
                      value={formData.contactInfo?.secondaryPhone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo!, secondaryPhone: e.target.value },
                        })
                      }
                      placeholder="(416) 555-0123"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Email Addresses Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Addresses
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryEmail" className="flex items-center gap-1">
                      Primary Email
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={formData.contactInfo?.primaryEmail || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo!, primaryEmail: e.target.value },
                        })
                      }
                      placeholder="info@royaldrivecanada.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={formData.contactInfo?.supportEmail || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo!, supportEmail: e.target.value },
                        })
                      }
                      placeholder="support@royaldrivecanada.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesEmail">Sales Email</Label>
                    <Input
                      id="salesEmail"
                      type="email"
                      value={formData.contactInfo?.salesEmail || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo!, salesEmail: e.target.value },
                        })
                      }
                      placeholder="sales@royaldrivecanada.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card >
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <CardTitle>Business Address</CardTitle>
              </div>
              <CardDescription>
                Physical location of your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="street" className="flex items-center gap-1">
                  Street Address
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  value={formData.address?.street || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address!, street: e.target.value },
                    })
                  }
                  placeholder="751 Danforth Road"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-1">
                    City
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, city: e.target.value },
                      })
                    }
                    placeholder="Toronto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="flex items-center gap-1">
                    Province / State
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="province"
                    value={formData.address?.province || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, province: e.target.value },
                      })
                    }
                    placeholder="Ontario"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="flex items-center gap-1">
                    Postal / ZIP Code
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.address?.postalCode || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, postalCode: e.target.value },
                      })
                    }
                    placeholder="M1K 1G9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-1">
                    Country
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.address?.country || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, country: e.target.value },
                      })
                    }
                    placeholder="Canada"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="pt-2">
                <Button onClick={handleSaveContact} disabled={saving} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Contact & Location"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === "social" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              <CardTitle>Social Media Links</CardTitle>
            </div>
            <CardDescription>
              Connect your social media profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Facebook */}
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia?.facebook || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia!, facebook: e.target.value },
                    })
                  }
                  placeholder="https://www.facebook.com/royaldrivecanada"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia?.instagram || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia!, instagram: e.target.value },
                    })
                  }
                  placeholder="https://www.instagram.com/royaldrivecanada"
                />
              </div>

              {/* Twitter/X */}
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-sky-500" />
                  Twitter / X
                </Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia?.twitter || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia!, twitter: e.target.value },
                    })
                  }
                  placeholder="https://twitter.com/royaldriveca"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.socialMedia?.linkedin || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia!, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://www.linkedin.com/company/royal-drive-canada"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  value={formData.socialMedia?.youtube || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia!, youtube: e.target.value },
                    })
                  }
                  placeholder="https://www.youtube.com/@royaldrivecanada"
                />
              </div>

              {/* TikTok */}
              <div className="space-y-2">
                <Label htmlFor="tiktok" className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-900" />
                  TikTok
                </Label>
                <Input
                  id="tiktok"
                  value={formData.socialMedia?.tiktok || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia!, tiktok: e.target.value },
                    })
                  }
                  placeholder="https://www.tiktok.com/@royaldrivecanada"
                />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Facebook Marketplace - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="facebookMarketplace" className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook Marketplace
              </Label>
              <Input
                id="facebookMarketplace"
                value={formData.socialMedia?.facebookMarketplace || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia!, facebookMarketplace: e.target.value },
                  })
                }
                placeholder="https://www.facebook.com/marketplace/profile/123456789"
              />
            </div>

            <Separator className="my-6" />

            <div className="pt-2">
              <Button onClick={handleSaveSocialMedia} disabled={saving} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Social Media Links"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Hours Tab */}
      {activeTab === "hours" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <CardTitle>Business Hours</CardTitle>
            </div>
            <CardDescription>
              Set your operating hours for each day of the week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.businessHours?.map((hour, index) => (
              <div key={hour.day} className="flex items-center gap-4 py-2">
                <div className="w-24 font-medium">{hour.day}</div>
                <Switch
                  checked={hour.isOpen}
                  onCheckedChange={(checked) => updateBusinessHour(index, "isOpen", checked)}
                />
                {hour.isOpen && (
                  <>
                    <Input
                      type="time"
                      value={hour.openTime || ""}
                      onChange={(e) => updateBusinessHour(index, "openTime", e.target.value)}
                      className="w-32"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={hour.closeTime || ""}
                      onChange={(e) => updateBusinessHour(index, "closeTime", e.target.value)}
                      className="w-32"
                    />
                  </>
                )}
                {!hour.isOpen && <span className="text-gray-500">Closed</span>}
              </div>
            ))}

            <Separator className="my-6" />

            <div className="pt-2">
              <Button onClick={handleSaveBusinessHours} disabled={saving} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Business Hours"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Tab */}
      {activeTab === "features" && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <CardTitle>Website Features</CardTitle>
              </div>
              <CardDescription>
                Enable or disable features on your public website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Test Drives</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to request test drives
                  </p>
                </div>
                <Switch
                  checked={formData.features?.enableTestDrive || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features!, enableTestDrive: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Financing</Label>
                  <p className="text-sm text-muted-foreground">
                    Show financing options to customers
                  </p>
                </div>
                <Switch
                  checked={formData.features?.enableFinancing || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features!, enableFinancing: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Trade-In</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to submit trade-in requests
                  </p>
                </div>
                <Switch
                  checked={formData.features?.enableTradeIn || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features!, enableTradeIn: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Online Booking</Label>
                  <p className="text-sm text-muted-foreground">
                    Let customers book appointments online
                  </p>
                </div>
                <Switch
                  checked={formData.features?.enableOnlineBooking || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features!, enableOnlineBooking: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Pricing</Label>
                  <p className="text-sm text-muted-foreground">
                    Display vehicle prices on the website
                  </p>
                </div>
                <Switch
                  checked={formData.features?.showPricing || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features!, showPricing: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure admin email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Contact Enquiries</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when customers contact you
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications?.newEnquiry || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      emailNotifications: { ...formData.emailNotifications!, newEnquiry: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Vehicle Enquiries</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for vehicle-specific enquiries
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications?.newVehicleEnquiry || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      emailNotifications: { ...formData.emailNotifications!, newVehicleEnquiry: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Car Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new car submission requests
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications?.newCarSubmission || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      emailNotifications: { ...formData.emailNotifications!, newCarSubmission: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily summary reports via email
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications?.dailyReport || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      emailNotifications: { ...formData.emailNotifications!, dailyReport: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Analytics & Tracking</CardTitle>
              </div>
              <CardDescription>
                Configure third-party analytics tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={formData.analytics?.googleAnalyticsId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      analytics: { ...formData.analytics!, googleAnalyticsId: e.target.value },
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  value={formData.analytics?.facebookPixelId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      analytics: { ...formData.analytics!, facebookPixelId: e.target.value },
                    })
                  }
                  placeholder="123456789012345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hotjarId">Hotjar Site ID</Label>
                <Input
                  id="hotjarId"
                  value={formData.analytics?.hotjarId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      analytics: { ...formData.analytics!, hotjarId: e.target.value },
                    })
                  }
                  placeholder="1234567"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveFeatures} disabled={saving} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Features & Settings"}
          </Button>
        </div>
      )}
    </div>
  )
}
