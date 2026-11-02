#!/usr/bin/env python3
"""
Builds the opening assistant's helper clip (roadmap 9b D19) from the full KayKit Adventurers 2.0 pack (CC0),
which lives outside the repo. The persona's own files in assets/3d/kaykit/ are not touched. The helper's model,
the Lorekeeper, is copied whole into assets/3d/kaykit-lorekeeper/ and needs no build.

  rig-medium-helper.glb  the clip the helper plays when an answer arrives, no meshes

Usage (from apps/web):
  python3 scripts/build_kaykit_helper.py "<path to KayKit_Adventurers_2.0_FREE>"

Default path: ~/Documents/Projects/AI Portfolio Projects/Design System/_resources/_3d-characters/KayKit_Adventurers_2.0_FREE
"""
import json
import os
import struct
import sys

DEFAULT_PACK = os.path.expanduser(
    '~/Documents/Projects/AI Portfolio Projects/Design System/_resources/_3d-characters/KayKit_Adventurers_2.0_FREE')
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', '3d', 'kaykit')

HELPER_CLIPS = {'Interact'}


def read_glb(path):
    data = open(path, 'rb').read()
    magic, _, _ = struct.unpack('<III', data[:12])
    assert magic == 0x46546C67, path + ' is not a GLB'
    jlen, = struct.unpack('<I', data[12:16])
    doc = json.loads(data[20:20 + jlen])
    rest = data[20 + jlen:]
    blen, = struct.unpack('<I', rest[:4])
    return doc, rest[8:8 + blen]


def write_glb(path, doc, binary):
    js = json.dumps(doc, separators=(',', ':')).encode()
    js += b' ' * (-len(js) % 4)
    binary += b'\0' * (-len(binary) % 4)
    total = 12 + 8 + len(js) + 8 + len(binary)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(js), 0x4E4F534A) + js)
        f.write(struct.pack('<II', len(binary), 0x004E4942) + binary)


def texture_refs(obj, out):
    """Every {"index": n} under a key ending in "Texture" (base colour, normal, emissive and so on)."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k.endswith('Texture') and isinstance(v, dict) and 'index' in v:
                out.append(v)
            texture_refs(v, out)
    elif isinstance(obj, list):
        for v in obj:
            texture_refs(v, out)


def reindex(items, used):
    """Keeps the used entries in order; returns the new list and old index -> new index."""
    keep = sorted(used)
    return [items[i] for i in keep], {old: new for new, old in enumerate(keep)}


def prune(doc, binary, keep_nodes, keep_clips):
    """Drops every mesh not on a node in keep_nodes and every clip not in keep_clips, then everything left unused.
    Nodes (the skeleton) stay, so clips and parts still bind by bone name."""
    assert not any('sparse' in a for a in doc.get('accessors', [])), 'sparse accessors are not handled'
    for node in doc['nodes']:
        if 'mesh' in node and node.get('name') not in keep_nodes:
            node.pop('mesh')
            node.pop('skin', None)
    doc['animations'] = [a for a in doc.get('animations', []) if a['name'] in keep_clips]

    meshes, mesh_map = reindex(doc.get('meshes', []), {n['mesh'] for n in doc['nodes'] if 'mesh' in n})
    skins, skin_map = reindex(doc.get('skins', []), {n['skin'] for n in doc['nodes'] if 'skin' in n})
    for n in doc['nodes']:
        if 'mesh' in n:
            n['mesh'] = mesh_map[n['mesh']]
        if 'skin' in n:
            n['skin'] = skin_map[n['skin']]

    used_acc, used_mat = set(), set()
    for m in meshes:
        for p in m['primitives']:
            used_acc.update(p['attributes'].values())
            if 'indices' in p:
                used_acc.add(p['indices'])
            for t in p.get('targets', []):
                used_acc.update(t.values())
            if 'material' in p:
                used_mat.add(p['material'])
    for s in skins:
        if 'inverseBindMatrices' in s:
            used_acc.add(s['inverseBindMatrices'])
    for a in doc['animations']:
        for s in a['samplers']:
            used_acc.update((s['input'], s['output']))

    materials, mat_map = reindex(doc.get('materials', []), used_mat)
    for m in meshes:
        for p in m['primitives']:
            if 'material' in p:
                p['material'] = mat_map[p['material']]
    refs = []
    texture_refs(materials, refs)
    textures, tex_map = reindex(doc.get('textures', []), {r['index'] for r in refs})
    for r in refs:
        r['index'] = tex_map[r['index']]
    images, img_map = reindex(doc.get('images', []), {t['source'] for t in textures if 'source' in t})
    samplers, smp_map = reindex(doc.get('samplers', []), {t['sampler'] for t in textures if 'sampler' in t})
    for t in textures:
        if 'source' in t:
            t['source'] = img_map[t['source']]
        if 'sampler' in t:
            t['sampler'] = smp_map[t['sampler']]

    accessors, acc_map = reindex(doc.get('accessors', []), used_acc)
    for m in meshes:
        for p in m['primitives']:
            p['attributes'] = {k: acc_map[v] for k, v in p['attributes'].items()}
            if 'indices' in p:
                p['indices'] = acc_map[p['indices']]
            p['targets'] = [{k: acc_map[v] for k, v in t.items()} for t in p.get('targets', [])] or None
            if p['targets'] is None:
                p.pop('targets')
    for s in skins:
        if 'inverseBindMatrices' in s:
            s['inverseBindMatrices'] = acc_map[s['inverseBindMatrices']]
    for a in doc['animations']:
        for s in a['samplers']:
            s['input'], s['output'] = acc_map[s['input']], acc_map[s['output']]

    used_views = {a['bufferView'] for a in accessors if 'bufferView' in a}
    used_views |= {i['bufferView'] for i in images if 'bufferView' in i}
    views, view_map = reindex(doc.get('bufferViews', []), used_views)
    out = bytearray()
    for v in views:
        out += b'\0' * (-len(out) % 4)
        start = v.get('byteOffset', 0)
        chunk = binary[start:start + v['byteLength']]
        v['byteOffset'] = len(out)
        v['buffer'] = 0
        out += chunk
    for a in accessors:
        if 'bufferView' in a:
            a['bufferView'] = view_map[a['bufferView']]
    for i in images:
        if 'bufferView' in i:
            i['bufferView'] = view_map[i['bufferView']]

    for key, items in (('meshes', meshes), ('skins', skins), ('materials', materials), ('textures', textures),
                       ('images', images), ('samplers', samplers), ('accessors', accessors), ('bufferViews', views),
                       ('animations', doc['animations'])):
        if items:
            doc[key] = items
        else:
            doc.pop(key, None)
    doc['buffers'] = [{'byteLength': len(out)}]
    return doc, bytes(out)


def build(src, dst, keep_nodes, keep_clips):
    doc, binary = read_glb(src)
    doc, binary = prune(doc, binary, keep_nodes, keep_clips)
    write_glb(dst, doc, binary)
    print(os.path.basename(dst), round(os.path.getsize(dst) / 1024), 'KB')


def main():
    pack = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_PACK
    build(os.path.join(pack, 'Animations', 'gltf', 'Rig_Medium', 'Rig_Medium_General.glb'),
          os.path.join(OUT, 'rig-medium-helper.glb'), set(), HELPER_CLIPS)


if __name__ == '__main__':
    main()
