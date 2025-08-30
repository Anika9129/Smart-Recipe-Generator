# Image Guidelines for Smart Recipe Generator

## Recipe Images Location
Place recipe images in: `public/images/recipes/`

## Naming Conventions

### Option 1: By Recipe ID
- `1.jpg` (for recipe with id: 1)
- `2.jpg` (for recipe with id: 2)
- `25.jpg` (for recipe with id: 25)

### Option 2: By Recipe Name (URL-friendly)
- `classic-spaghetti-carbonara.jpg`
- `chicken-tikka-masala.jpg`
- `chocolate-chip-cookies.jpg`

### Option 3: With Recipe Prefix
- `recipe-1.jpg`
- `recipe-2.jpg`
- `recipe-25.jpg`

## Recommended Image Specifications
- **Format**: JPG or PNG
- **Size**: 600x400px (3:2 aspect ratio)
- **File Size**: Under 500KB for fast loading
- **Quality**: High enough to look good but optimized for web

## Example File Structure
```
public/images/
├── recipes/
│   ├── 1.jpg                           (Spaghetti Carbonara)
│   ├── 2.jpg                           (Chicken Tikka Masala)
│   ├── 3.jpg                           (Caesar Salad)
│   ├── default-recipe.jpg              (Fallback image)
│   └── ...
├── logo.png                            (App logo)
├── favicon.ico                         (Browser tab icon)
└── cooking-background.jpg              (Background images)
```

## How Images Are Used
1. The app will automatically look for images using multiple naming patterns
2. If no image is found, it displays a gradient background with a cooking emoji
3. Images are responsive and will scale properly on different screen sizes

## Adding New Images
1. Save your recipe images in `public/images/recipes/`
2. Name them using one of the conventions above
3. The app will automatically display them - no code changes needed!
