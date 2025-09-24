import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { auth } from "~/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("royaldrivemotor@gmail.com")
  const [password, setPassword] = useState("RoyalDrive@123#")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      await auth.login(email, password)
      
      toast.success("Login successful!")
      navigate("/", { replace: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8">
          {/* Left side - Logo and description */}
          <div className="flex flex-col justify-center space-y-6 md:pl-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold md:text-3xl">Royal Drive Motors</h1>
              <p className="text-muted-foreground">
                Professional vehicle inventory management system for Royal Drive Motors. 
                Manage your fleet, track sales, and streamline operations.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Complete vehicle inventory management</li>
                <li>• Real-time sales tracking</li>
                <li>• Customer management system</li>
                <li>• Comprehensive reporting</li>
              </ul>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome to Royal Drive Admin</CardTitle>
                <CardDescription>
                  Sign in to your account to manage the vehicle inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@royaldrive.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Default credentials info */}
        <div className="mt-6 text-center">
          <div className="text-muted-foreground text-center text-xs text-balance">
            <p className="text-gray-600">
              Default credentials: <br />
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">royaldrivemotor@gmail.com</code> / 
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">RoyalDrive@123#</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
