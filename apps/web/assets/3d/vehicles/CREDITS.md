# Strategy vehicles: credits

The five models the investment strategies travel with (roadmap 9c), from Poly Pizza. Shown on the Character kit page, whose Credits section repeats this list.

| File | Model | Author | Licence | Source |
|---|---|---|---|---|
| `tent.glb` | Tent | Quaternius | CC0 1.0 | https://poly.pizza/m/5Q7qIrfDxA |
| `tricycle.glb` | Tricycle | Poly by Google | CC BY 3.0 | https://poly.pizza/m/9UE6AhwMhbc |
| `vespa.glb` | Vespa | Jasmine Roberts | CC BY 3.0 | https://poly.pizza/m/blGLclvvdEM |
| `parachute.glb` | Parachute | Poly by Google | CC BY 3.0 | https://poly.pizza/m/3Z7vJ96JIEB |
| `jetpack.glb` | Jetpack | Roman Miller | CC BY 3.0 | https://poly.pizza/m/8VafbXInymc |

CC BY 3.0: https://creativecommons.org/licenses/by/3.0/

## Changes

- Renamed. At run time every model is scaled and recoloured to the app's theme (`js/character-vehicles.js`); the files themselves are as downloaded, except the Vespa.
- The Vespa came as OBJ and MTL and was converted to GLB once with Blender 5.1 (from `apps/web`, the script in a temporary file):

  ```python
  import bpy, sys
  src, out = sys.argv[sys.argv.index('--') + 1:]
  bpy.ops.wm.read_factory_settings(use_empty=True)
  bpy.ops.wm.obj_import(filepath=src)
  bpy.ops.export_scene.gltf(filepath=out, export_format='GLB')
  ```

  ```
  /Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python vespa.py -- "<path>/Vespa.obj" assets/3d/vehicles/vespa.glb
  ```

The originals, with the models not used, are outside the repo in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261028_product-opening/3d-models/poly-pizza_models-various/`.
