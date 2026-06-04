import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Mic2, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/Button'

export function Navbar() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-white' : 'text-slate-400 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/30">
            <Mic2 className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-xl tracking-tight text-white">
            Interview<span className="text-accent-hover">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {!loading && user && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <span className="hidden text-sm text-slate-500 sm:inline">
                {user.username}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          )}
          {!loading && !user && (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white">
                Sign in
              </Link>
              <Link to="/register">
                <Button size="sm">
                  <Sparkles className="h-4 w-4" />
                  Get started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
