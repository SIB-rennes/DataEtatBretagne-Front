export function _path_full(ej: string, poste_ej: string) {
  return `detail_ligne/${ej}/${poste_ej}`;
}

export function router_template_path_full() {
  return _path_full(':ej', ':poste_ej')
}
