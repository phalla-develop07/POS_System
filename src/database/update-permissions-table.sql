ALTER TABLE permissions
  ADD COLUMN IF NOT EXISTS slug VARCHAR(100) NULL AFTER name,
  ADD COLUMN IF NOT EXISTS module VARCHAR(100) NULL AFTER slug;

UPDATE permissions
SET
  slug = UPPER(name),
  name = CONCAT(
    UCASE(LEFT(REPLACE(LOWER(name), '_', ' '), 1)),
    SUBSTRING(REPLACE(LOWER(name), '_', ' '), 2)
  ),
  module = SUBSTRING_INDEX(LOWER(slug), '_', -1)
WHERE slug IS NULL OR slug = '';

UPDATE permissions
SET
  name = REPLACE(name, ' users', ' Users'),
  name = REPLACE(name, ' products', ' Products'),
  name = REPLACE(name, ' sales', ' Sales'),
  name = REPLACE(name, ' reports', ' Reports'),
  name = REPLACE(name, ' roles', ' Roles'),
  name = REPLACE(name, ' permissions', ' Permissions'),
  name = REPLACE(name, ' orders', ' Orders'),
  name = REPLACE(name, ' employees', ' Employees'),
  name = REPLACE(name, ' inventory', ' Inventory'),
  name = REPLACE(name, 'Manage', 'Manage'),
  name = REPLACE(name, 'View', 'View'),
  name = REPLACE(name, 'Create', 'Create'),
  name = REPLACE(name, 'Update', 'Update'),
  name = REPLACE(name, 'Delete', 'Delete');

ALTER TABLE permissions
  DROP COLUMN IF EXISTS description,
  DROP INDEX IF EXISTS IDX_48ce552495d14eae9b187bb671,
  MODIFY id BIGINT NOT NULL AUTO_INCREMENT,
  MODIFY name VARCHAR(100) NOT NULL,
  MODIFY slug VARCHAR(100) NOT NULL,
  MODIFY module VARCHAR(100) NOT NULL,
  MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFY updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD UNIQUE KEY IF NOT EXISTS IDX_permissions_slug (slug);
