# shadcn/ui Components Documentation

## Overview
This directory contains all shadcn/ui components configured with the "New York" style and Stone color scheme.

## Installed Components

### Core Components
- **Button** - Various button variants (default, secondary, outline, ghost, destructive)
- **Card** - Content containers with header, content, and description sections
- **Input** - Form input fields with proper styling
- **Badge** - Status indicators and labels

### Interactive Components
- **Dialog** - Modal dialogs and overlays
- **Select** - Dropdown selection components
- **Checkbox** - Form checkboxes with proper states
- **Dropdown Menu** - Context menus and dropdowns
- **Tabs** - Tabbed interface components

### Layout Components
- **Separator** - Visual dividers between content
- **Toast/Toaster** - Notification system

### Advanced Components
- **Calendar** - Date picker with react-day-picker integration
- **Theme Toggle** - Dark/light mode switcher

## Usage Examples

### Button
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Click me</Button>
<Button variant="outline" size="sm">Small outline</Button>
<Button variant="destructive">Delete</Button>
```

### Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description here</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Theme Toggle
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

<ThemeToggle />
```

### Dialog
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Select
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Tab 1 content</TabsContent>
  <TabsContent value="tab2">Tab 2 content</TabsContent>
</Tabs>
```

## Theme Configuration

### Colors (Stone Base)
- Primary: Stone-based color scheme
- Support for light/dark modes
- CSS variables for dynamic theming

### Theme Provider Setup
```tsx
import { ThemeProvider } from '@/components/providers/ThemeProvider'

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### Using Theme Hook
```tsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
```

## File Structure
```
components/
├── providers/
│   ├── ThemeProvider.tsx    # next-themes wrapper
│   └── index.tsx            # Combined providers
└── ui/
    ├── badge.tsx
    ├── button.tsx
    ├── calendar.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── input.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── tabs.tsx
    ├── theme-toggle.tsx     # Custom theme switcher
    ├── toast.tsx
    ├── toaster.tsx
    └── README.md            # This file
```

## Dependencies
All components use Radix UI primitives for accessibility and functionality:
- @radix-ui/react-slot
- @radix-ui/react-dialog
- @radix-ui/react-select
- @radix-ui/react-checkbox
- @radix-ui/react-dropdown-menu
- @radix-ui/react-toast
- @radix-ui/react-separator
- @radix-ui/react-tabs
- react-day-picker (for calendar)
- next-themes (for theme management)

## Testing
All components are tested on the main page with various variants and states. Theme switching between light/dark/system modes is fully functional.