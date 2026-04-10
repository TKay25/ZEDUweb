const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');

// Components that use default exports
const uiComponents = [
  'Alert', 'Avatar', 'Badge', 'Button', 'Card', 'Checkbox', 
  'Input', 'Modal', 'Pagination', 'ProgressBar', 'Radio', 
  'Select', 'Spinner', 'Table', 'Tabs', 'Textarea', 'Toast'
];

const studentComponents = [
  'CourseCard', 'LessonPlayer'
];

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix UI component imports
  uiComponents.forEach(component => {
    // Match: import { Component } from '../../components/ui/Component'
    const namedImportRegex = new RegExp(`import \\{ ${component} \\} from ['"]([^'"]*\\/ui\\/${component})['"]`, 'g');
    if (namedImportRegex.test(content)) {
      content = content.replace(
        new RegExp(`import \\{ ${component} \\} from ['"]([^'"]*\\/ui\\/${component})['"]`, 'g'),
        `import ${component} from '$1'`
      );
      modified = true;
    }

    // Also match: import { Component as Something } from '...'
    const namedImportAsRegex = new RegExp(`import \\{ ${component} as (\\w+) \\} from ['"]([^'"]*\\/ui\\/${component})['"]`, 'g');
    if (namedImportAsRegex.test(content)) {
      content = content.replace(
        new RegExp(`import \\{ ${component} as (\\w+) \\} from ['"]([^'"]*\\/ui\\/${component})['"]`, 'g'),
        `import $1 from '$2'`
      );
      modified = true;
    }
  });

  // Fix student component imports
  studentComponents.forEach(component => {
    const namedImportRegex = new RegExp(`import \\{ ${component} \\} from ['"]([^'"]*\\/student\\/${component})['"]`, 'g');
    if (namedImportRegex.test(content)) {
      content = content.replace(
        new RegExp(`import \\{ ${component} \\} from ['"]([^'"]*\\/student\\/${component})['"]`, 'g'),
        `import ${component} from '$1'`
      );
      modified = true;
    }
  });

  // Fix API imports (if they're also default exports)
  content = content.replace(
    /import \{ tutorAPI \} from ['"]([^'"]*\/api\/tutor\.api)['"]/g,
    "import tutorAPI from '$1'"
  );

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed imports in: ${filePath}`);
    return true;
  }
  return false;
}

function scanDirectory(dir) {
  let fixedCount = 0;
  
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixImportsInFile(filePath)) {
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

console.log('🔍 Scanning for import issues...');
const fixed = scanDirectory(pagesDir);
console.log(`\n🎉 Fixed ${fixed} files!`);