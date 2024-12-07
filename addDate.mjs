import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import yaml from 'js-yaml';

const getCurrentTime = () => {
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    const date = new Date(Date.now() - timezoneOffset);
    return date.toISOString();
}

const updateMdFile = () => {
    const files = glob.sync('**/*.md', {
        cwd: './source/_posts',
    });

    files.forEach((file) => {
        const filePath = path.join('./source/_posts', file);
        const content = fs.readFileSync(filePath, 'utf8');

        const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (yamlMatch) {
            const yamlContent = yamlMatch[1];
            const bodyContent = content.slice(yamlMatch[0].length);

            const yamlData = yaml.load(yamlContent);
            if (!yamlData.date) {
                yamlData.date = getCurrentTime();
            }

            const updatedYamlContent = yaml.dump(yamlData);
            const updatedContent = `---\n${updatedYamlContent}\n---\n${bodyContent}`;
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated date for: ${file}`);
        } else {
            console.log(`No YAML front matter found in: ${file}`);
        }
    });
}

updateMdFile();
