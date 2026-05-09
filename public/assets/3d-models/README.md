# 3D Model Assets Folder

## Folder Structure
```
public/assets/3d-models/
├── food-images/          # Food item images for 3D plates
│   ├── pratha.jpg        # Aloo Paratha image
│   ├── chanay.jpg        # Chana Masala image  
│   ├── egg-curry.jpg     # Egg Curry image
│   ├── biryani.jpg       # Chicken Biryani image
│   ├── chicken-nihari.jpg # Chicken Nihari image
│   ├── beef-nihari.jpg   # Beef Nihari image
│   └── lassi.jpg         # Fresh Lassi image
└── models/               # 3D model files (if needed in future)
```

## How to Add Images

1. **Place your food images** in `public/assets/3d-models/food-images/`
2. **Use these exact filenames**:
   - `pratha.jpg` for Aloo Paratha
   - `chanay.jpg` for Chana Masala
   - `egg-curry.jpg` for Egg Curry
   - `biryani.jpg` for Chicken Biryani
   - `chicken-nihari.jpg` for Chicken Nihari
   - `beef-nihari.jpg` for Beef Nihari
   - `lassi.jpg` for Fresh Lassi

3. **Image Requirements**:
   - Format: JPG, PNG, or WebP
   - Size: 512x512 pixels or higher
   - Quality: High quality, good lighting
   - Background: Preferably transparent or plain

## Usage in Code

Images are automatically loaded from this folder in the Hero3D component.

## Example Image Path
```javascript
'/assets/3d-models/food-images/pratha.jpg'
```

## Notes
- Images placed here will be publicly accessible
- Keep file sizes reasonable for fast loading
- Use square images for best 3D plate appearance
