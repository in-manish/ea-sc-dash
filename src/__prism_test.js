import Prism from 'prismjs';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-django';

export function testHighlight(sample) {
  return Prism.highlight(sample, Prism.languages.django, 'django');
}
