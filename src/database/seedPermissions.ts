import { AppDataSource } from './data-source';
import { getDefaultPermissionPayloads } from '../constants/permissions';
import { PermissionSchema } from '../modules/permissions/models/Permission';

const defaultPermissions = getDefaultPermissionPayloads();

export async function seedPermissions() {
  const permissionRepository = AppDataSource.getRepository(PermissionSchema);
  let insertedCount = 0;

  for (const permission of defaultPermissions) {
    const existingPermission = await permissionRepository.findOne({
      where: [
        { slug: permission.slug },
        { name: permission.slug }
      ]
    });

    if (!existingPermission) {
      await permissionRepository.save(permission);
      insertedCount += 1;
    } else if (
      existingPermission.name !== permission.name ||
      existingPermission.slug !== permission.slug ||
      existingPermission.module !== permission.module
    ) {
      await permissionRepository.update(existingPermission.id, permission);
    }
  }

  return insertedCount;
}
