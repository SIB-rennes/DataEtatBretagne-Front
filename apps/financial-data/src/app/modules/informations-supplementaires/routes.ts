
export function _path_full(source:string, id: string) {
  return `detail_ligne/${source}/${id}`;
}

export function router_template_path_full() {
  return _path_full(':source', ':id')
}
