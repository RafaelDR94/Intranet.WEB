import { describe, expect, it } from 'vitest';

import {
  mapLocationPost,
  mapLocationPut,
  mapProyectLocation,
} from './location.mapper';

describe('location.mapper', () => {
  it('maps optional proyects for post and put payloads', () => {
    expect(
      mapLocationPost({
        name: 'Ubicacion 1',
        linkmaps: 'https://maps.test/location',
        address: 'Direccion 1',
        proyects: ['  project-1  ', '', 'project-2'],
      }),
    ).toEqual({
      name: 'Ubicacion 1',
      linkmaps: 'https://maps.test/location',
      address: 'Direccion 1',
      proyects: ['project-1', 'project-2'],
    });

    expect(
      mapLocationPut({
        id: 'location-1',
        name: 'Ubicacion 1',
        linkmaps: 'https://maps.test/location',
        address: 'Direccion 1',
        proyects: ['  project-1  '],
      }),
    ).toEqual({
      id: 'location-1',
      name: 'Ubicacion 1',
      linkmaps: 'https://maps.test/location',
      address: 'Direccion 1',
      proyects: ['project-1'],
    });
  });

  it('maps locations from either proyect or proyects in api responses', () => {
    expect(
      mapProyectLocation({
        id: 'location-1',
        name: 'Ubicacion 1',
        linkmaps: 'https://maps.test/location',
        address: 'Direccion 1',
        proyects: [{ id: 'project-1', proyectKey: 'PRJ-001' }],
      }),
    ).toEqual({
      id: 'location-1',
      name: 'Ubicacion 1',
      linkmaps: 'https://maps.test/location',
      address: 'Direccion 1',
      proyect: [{ id: 'project-1', proyectKey: 'PRJ-001' }],
    });
  });
});
