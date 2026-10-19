import * as migration_20261015_074724_initial from './20261015_074724_initial';
import * as migration_20261015_090922_legal_consent_brand from './20261015_090922_legal_consent_brand';
import * as migration_20261019_042357_i18n_localization from './20261019_042357_i18n_localization';

export const migrations = [
  {
    up: migration_20261015_074724_initial.up,
    down: migration_20261015_074724_initial.down,
    name: '20261015_074724_initial',
  },
  {
    up: migration_20261015_090922_legal_consent_brand.up,
    down: migration_20261015_090922_legal_consent_brand.down,
    name: '20261015_090922_legal_consent_brand',
  },
  {
    up: migration_20261019_042357_i18n_localization.up,
    down: migration_20261019_042357_i18n_localization.down,
    name: '20261019_042357_i18n_localization'
  },
];
