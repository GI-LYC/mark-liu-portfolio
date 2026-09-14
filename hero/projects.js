export const archiveKey = id => 'archive-' + encodeURIComponent(String(id)).replaceAll('%', '_');
export function getDeckProjects(data, manifest = {}) {
  return data.projects.slice(0, 10).map((project, index) => {
    // Asset identity does not change when the presentation order changes.
    const id = project.id;
    const source = project.media?.some(media => media.src === data.heroCover) ? data.heroCover : project.cover;
    const prepared = manifest[id];
    const width = prepared?.width || project.originalWidth || 1600;
    const height = prepared?.height || project.originalHeight || 900;
    return {
      id, index, project, source, title: project.title,
      category: project.type || project.category || 'VISUAL DESIGN',
      role: project.role || 'Creative Direction / AI Visual', year: project.year || '',
      url: project.url || `project.html?id=${encodeURIComponent(project.id)}`,
      originalWidth: width, originalHeight: height, ratio: width / height,
      originalAspectRatio: `${width} / ${height}`, previewAspectRatio: '4 / 5',
      previewPosition: project.previewPosition || (width / height < 1 ? '50% 38%' : '50% 50%'),
      thumb: prepared ? new URL(prepared.thumb, import.meta.url).href : source,
      cover: prepared ? new URL(prepared.cover, import.meta.url).href : source,
      videoPreview: project.videoPreview || project.media?.find(media => media.type === 'video')?.src || null
    };
  });
}
