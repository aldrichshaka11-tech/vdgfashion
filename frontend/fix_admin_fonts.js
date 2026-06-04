const fs = require('fs');

const path = 'c:/xampp/hardik/htdocs/vgd-fashion/frontend/src/app/admin/page.js';
let content = fs.readFileSync(path, 'utf8');

// Strip all bold fonts and replace with font-normal
content = content.replace(/\bfont-(bold|semibold|black|extrabold|medium)\b/g, 'font-normal');

// Add the Poppins override
const oldDiv = "    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#0f121a]' : 'bg-zinc-50'}`}>";
const injection = `
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');
        .admin-panel-container {
          font-family: 'Poppins', Arial, sans-serif !important;
        }
        .admin-panel-container * {
          font-family: 'Poppins', Arial, sans-serif !important;
          font-weight: 400 !important;
        }
      \`}} />`;

const newDiv = "    <div className={`flex h-screen overflow-hidden admin-panel-container ${theme === 'dark' ? 'bg-[#0f121a]' : 'bg-zinc-50'}`}>\n" + injection;

content = content.replace(oldDiv, newDiv);

fs.writeFileSync(path, content);
console.log('Successfully removed bold fonts and injected Poppins.');
