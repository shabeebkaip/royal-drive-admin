import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [key, setKey] = useState(0)
  const navigate = useNavigate()

  // Force clear fields on mount
  useEffect(() => {
    setEmail("")
    setPassword("")
    setKey(prev => prev + 1)
  }, [])

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
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl">
          <div className="flex flex-col md:grid md:grid-cols-2">
            {/* Left side - Logo and description */}
            <div className="flex flex-col justify-center space-y-8 p-8 md:p-12 bg-card border-b md:border-b-0 md:border-r">
              <div className="space-y-6">
                <div className="inline-block">
                  <img src="/Colour.svg" alt="Royal Drive" className="h-20 w-auto md:h-24" />
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">Royal Drive Canada</h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Professional vehicle inventory management system. 
                  Manage your fleet, track sales, and streamline operations.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key Features</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">Complete vehicle inventory management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">Real-time sales tracking and analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">Customer and enquiry management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">Comprehensive reporting dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right side - Login form */}
            <div className="flex items-center justify-center p-8 md:p-12">
              <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Welcome back</h2>
                  <p className="text-muted-foreground text-base">
                    Sign in to your admin account
                  </p>
                </div>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        key={`email-${key}`}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input 
                          key={`password-${key}`}
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                          required
                          disabled={isLoading}
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <IconEyeOff className="h-5 w-5" />
                          ) : (
                            <IconEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
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
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
