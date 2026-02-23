#!/usr/bin/env node

/**
 * Script pour vérifier uniquement les fichiers TypeScript purs (sans les .vue)
 */

const { execSync } = require('child_process');
const path = require('path');

try {
    console.log('🔍 Vérification TypeScript (fichiers .ts/.tsx uniquement)...\n');
    
    // Créer un tsconfig temporaire qui exclut les fichiers Vue
    const tempTsConfig = {
        "extends": "./tsconfig.json",
        "include": [
            "src/**/*.ts",
            "src/**/*.tsx"
        ],
        "exclude": [
            "src/**/*.vue"
        ]
    };
    
    const fs = require('fs');
    const tempConfigPath = path.join(__dirname, '..', 'tsconfig.temp.json');
    fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsConfig, null, 2));
    
    // Exécuter la vérification TypeScript
    execSync(`npx tsc --noEmit --project tsconfig.temp.json`, {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
    });
    
    // Nettoyer le fichier temporaire
    fs.unlinkSync(tempConfigPath);
    
    console.log('✅ Aucune erreur TypeScript dans les fichiers .ts/.tsx');
    
} catch (error) {
    // Nettoyer le fichier temporaire en cas d'erreur
    const fs = require('fs');
    const tempConfigPath = path.join(__dirname, '..', 'tsconfig.temp.json');
    if (fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath);
    }
    
    if (error.stdout) {
        console.log(error.stdout);
    }
    
    // Compter les erreurs
    const errorLines = error.stdout ? error.stdout.split('\n').filter(line => line.includes('error TS')) : [];
    console.log(`\n❌ ${errorLines.length} erreur(s) TypeScript trouvée(s) dans les fichiers .ts/.tsx`);
    
    process.exit(1);
}