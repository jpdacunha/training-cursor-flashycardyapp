# shadcn/ui Integration Guide

## Overview

This project uses **shadcn/ui** as its UI component system. shadcn/ui is not a traditional component library but rather a collection of reusable components that are copied directly into your project via CLI.

## What is shadcn/ui?

shadcn/ui is a **component collection system** that differs fundamentally from traditional UI libraries:

- **Not an npm package**: There is no `@shadcn/ui` package to install
- **Copy-paste approach**: Components are copied into your project's codebase
- **You own the code**: Components become part of your source code, not external dependencies
- **Built on primitives**: Uses Radix UI primitives and Tailwind CSS for styling

### Philosophy

> "It's not a component library. It's a collection of reusable components that you can copy and paste into your apps."
> 
> — shadcn (creator)

## Why shadcn/ui?

### Advantages

1. **Full Control**
   - Complete ownership of component source code
   - Modify any component to fit specific needs
   - No dependency on external library versions

2. **Optimal Bundle Size**
   - Only components you use are in your bundle
   - Perfect tree-shaking by default
   - No unused code shipped to production

3. **Customization**
   - Direct access to component implementation
   - Easy to adapt styling and behavior
   - No need to work around library constraints

4. **No Breaking Changes**
   - Updates are opt-in (run CLI command)
   - Full control over when to update components
   - Review changes before applying

5. **Transparency**
   - All code is visible and readable
   - Easy to debug and understand
   - Learn from well-structured code

6. **TypeScript First**
   - Full TypeScript support
   - Type-safe component props
   - Excellent IDE integration

### Trade-offs

1. **Manual Updates**
   - Component updates require manual CLI commands
   - Need to track upstream changes yourself

2. **Initial Setup**
   - Requires CLI configuration
   - Need to understand the architecture

3. **Maintenance Responsibility**
   - You maintain the component code
   - Need to ensure consistency across components

## Architecture

### Project Structure

```
project-root/
├── components/
│   └── ui/                    # shadcn/ui components (YOUR code)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
├── components.json           # shadcn/ui configuration
└── package.json             # Dependencies (Radix UI, CVA, etc.)
```

### Configuration

shadcn/ui is configured in `components.json`:

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Dependencies

The actual npm dependencies installed are:

```json
{
  "@radix-ui/react-*": "Primitives for accessible components",
  "class-variance-authority": "For variant-based styling",
  "clsx": "Conditional className utilities",
  "tailwind-merge": "Merge Tailwind classes intelligently"
}
```

## How It Works

### Installation Flow

1. **Initialize shadcn/ui** (one-time setup)
   ```bash
   npx shadcn@latest init
   ```

2. **Add a component**
   ```bash
   npx shadcn@latest add button
   ```

3. **What happens:**
   - CLI downloads the component source code
   - Code is copied to `components/ui/button.tsx`
   - Required dependencies are installed (if not already present)
   - The file becomes part of YOUR codebase

4. **Use the component**
   ```typescript
   import { Button } from "@/components/ui/button"
   
   export function MyComponent() {
     return <Button>Click me</Button>
   }
   ```

### Component Anatomy

Example: Button component structure

```typescript
// components/ui/button.tsx

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Variant definitions using CVA
const buttonVariants = cva(
  "base-classes...",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
        // ...
      },
      size: {
        default: "...",
        sm: "...",
        // ...
      }
    }
  }
)

// Component with forwardRef for ref forwarding
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Button, buttonVariants }
```

### Key Patterns

1. **React.forwardRef**
   - All components use `forwardRef` for proper ref forwarding
   - Enables parent components to access DOM elements

2. **Class Variance Authority (CVA)**
   - Manages component variants (styles, sizes)
   - Type-safe variant props

3. **cn() Utility**
   - Merges Tailwind classes intelligently
   - Handles conditional classes
   - Located in `lib/utils.ts`

4. **Radix UI Primitives**
   - Accessible, unstyled components as foundation
   - Handle complex interactions (dropdowns, dialogs, etc.)

5. **Tailwind CSS**
   - All styling via Tailwind utility classes
   - CSS variables for theming
   - Dark mode support built-in

## Usage Guide

### Adding New Components

1. **Check availability**
   - Visit [shadcn/ui documentation](https://ui.shadcn.com/docs/components)
   - Find the component you need

2. **Install via CLI**
   ```bash
   npx shadcn@latest add <component-name>
   ```

3. **Verify installation**
   - Check `components/ui/<component-name>.tsx` exists
   - Review the component code

4. **Import and use**
   ```typescript
   import { ComponentName } from "@/components/ui/component-name"
   ```

### Customizing Components

Since you own the code, customization is straightforward:

1. **Open the component file**
   ```
   components/ui/button.tsx
   ```

2. **Modify as needed**
   - Change default styles
   - Add new variants
   - Adjust behavior

3. **Example: Adding a new variant**
   ```typescript
   const buttonVariants = cva(
     "...",
     {
       variants: {
         variant: {
           default: "...",
           destructive: "...",
           custom: "bg-purple-500 text-white hover:bg-purple-600", // New!
         }
       }
     }
   )
   ```

### Updating Components

To update a component to the latest version:

```bash
npx shadcn@latest add button --overwrite
```

**Warning:** This will overwrite your local modifications. Review changes before applying.

## Current Components

**Last verified: 2026-01-21**

The following components are currently installed:

- ✅ `button.tsx` - Button with variants (default, destructive, outline, secondary, ghost, link)
- ✅ `card.tsx` - Card with sub-components (Header, Title, Description, Content, Footer, Action)
- ✅ `input.tsx` - Text input field
- ✅ `textarea.tsx` - Multi-line text input
- ✅ `dropdown-menu.tsx` - Dropdown menu with items, checkboxes, radio groups
- ✅ `progress.tsx` - Progress indicator
- ✅ `separator.tsx` - Visual separator line

All components use official shadcn/ui implementations with `React.forwardRef`.

## Best Practices

### DO ✅

1. **Use official components first**
   - Always check if shadcn/ui has the component
   - Prefer official implementations

2. **Keep components in sync**
   - Periodically check for updates
   - Review upstream changes

3. **Leverage composition**
   - Combine components for complex UIs
   - Build higher-level components from primitives

4. **Follow Tailwind conventions**
   - Use Tailwind classes for styling
   - Maintain consistency with existing components

5. **Use TypeScript fully**
   - Define proper prop types
   - Leverage type inference

### DON'T ❌

1. **Don't create custom UI primitives**
   - Use shadcn/ui components instead
   - Only create custom components when shadcn/ui doesn't offer equivalent

2. **Don't modify component structure drastically**
   - Small customizations are fine
   - Major changes make updates difficult

3. **Don't bypass the CLI**
   - Always use `npx shadcn@latest add`
   - Don't copy code manually from docs

4. **Don't forget accessibility**
   - shadcn/ui components are accessible by default
   - Maintain accessibility when customizing

## Custom Components Policy

### When Custom Components Are Allowed

Create custom components **ONLY** when:

1. Component doesn't exist in shadcn/ui
2. Cannot be achieved by composing existing components
3. Specific functionality required that shadcn/ui doesn't provide

### Requirements for Custom Components

1. **Location**: Place in `components/` (NOT `components/ui/`)
   - `components/ui/` is reserved for shadcn/ui components only

2. **Naming**: Use descriptive, unique names
   - Good: `TimelineCard`, `AnimatedCounter`
   - Bad: `Card`, `Button`

3. **Documentation**: Add JSDoc comments
   ```typescript
   /**
    * Custom Component: ComponentName
    * 
    * Purpose: Why this component exists
    * Reason: Not available in shadcn/ui
    * Verified: 2026-01-21
    */
   ```

4. **Build on shadcn/ui**: Use shadcn/ui components as building blocks
   ```typescript
   import { Button } from "@/components/ui/button"
   
   export function LoadingButton({ isLoading, ...props }) {
     return <Button disabled={isLoading} {...props}>...</Button>
   }
   ```

## Integration with Next.js

### Server Components

shadcn/ui components work with Next.js Server Components:

```typescript
// app/page.tsx (Server Component)
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div>
      <Button>Server-rendered Button</Button>
    </div>
  )
}
```

### Client Components

Use `"use client"` directive when needed:

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  )
}
```

### Forms

Combine with form libraries:

```typescript
"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const { register, handleSubmit } = useForm()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("email")} type="email" />
      <Button type="submit">Login</Button>
    </form>
  )
}
```

## Theming

### CSS Variables

shadcn/ui uses CSS variables for theming (defined in `app/globals.css`):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... */
}
```

### Customizing Theme

1. Modify CSS variables in `app/globals.css`
2. Components automatically use new colors
3. Dark mode works out of the box

## Resources

- **Official Documentation**: https://ui.shadcn.com
- **Component Examples**: https://ui.shadcn.com/docs/components
- **GitHub Repository**: https://github.com/shadcn-ui/ui
- **Radix UI Documentation**: https://www.radix-ui.com

## Troubleshooting

### Component Not Found

**Problem**: Import error for component

**Solution**:
```bash
npx shadcn@latest add <component-name>
```

### Style Conflicts

**Problem**: Component styles not applying

**Solution**:
1. Check Tailwind CSS is configured correctly
2. Verify `globals.css` is imported
3. Ensure CSS variables are defined

### Type Errors

**Problem**: TypeScript errors with component props

**Solution**:
1. Check component file uses correct types
2. Verify `@radix-ui/react-*` packages are installed
3. Update TypeScript to latest version

### Update Conflicts

**Problem**: Overwriting customized component

**Solution**:
1. Backup your changes before updating
2. Review diff after update
3. Re-apply customizations if needed

## Summary

shadcn/ui provides a unique approach to UI components by giving you full ownership of the code while maintaining high-quality, accessible components. This architecture offers maximum flexibility and control, making it ideal for projects that need customization while benefiting from well-crafted component foundations.

Key takeaways:
- Components are copied into your project, not imported from npm
- You own and maintain the component code
- Built on solid foundations (Radix UI + Tailwind CSS)
- Perfect for projects requiring customization and control
- Requires understanding of the architecture and manual updates
