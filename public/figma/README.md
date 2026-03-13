Add your own Figma media here when you are ready.

The `/tech/figma` page now supports admin-only uploads for videos and images.
Admin uploads are saved into `public/figma/uploads/...` and tracked metadata is saved in `data/figma-gallery.json`.
Use the files in this folder if you want permanent repo assets that will be included when you commit and push.

Suggested files:

1. `public/figma/portfolio-demo.mp4`
2. `public/figma/dashboard-demo.mp4`
3. `public/figma/mobile-app-demo.mp4`
4. `public/figma/portfolio-shot-01.png`
5. `public/figma/dashboard-shot-01.png`
6. `public/figma/mobile-shot-01.png`

Notes:

- Use short MP4 clips for the `Videos` tab.
- Use PNG or JPG screens for the `Images` tab.
- After adding media, update `src/components/FigmaDesignShowcase.tsx` with the new paths.
