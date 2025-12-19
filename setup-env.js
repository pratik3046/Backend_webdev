#!/usr/bin/env node

/**
 * Backend Environment Setup Script for Web Dev Hub
 * This script helps set up backend environment files securely
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Web Dev Hub Backend Environment Setup\n');

// Generate secure random strings
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

function generateJWTSecret() {
    return crypto.randomBytes(64).toString('hex');
}

// Check if .env file exists
function checkEnvFile() {
    const envFile = path.join(__dirname, '.env');
    
    console.log('📋 Checking backend environment file...\n');
    
    if (!fs.existsSync(envFile)) {
        console.log('❌ Backend .env file not found');
        console.log('   Please copy .env.example to .env');
        return false;
    } else {
        console.log('✅ Backend .env file exists');
        return true;
    }
}

// Generate secure secrets
function generateSecrets() {
    console.log('\n🔐 Generated Secure Secrets for Backend:\n');
    
    console.log('# Add these to your backend/.env file:');
    console.log('JWT_SECRET=' + generateJWTSecret());
    console.log('SESSION_SECRET=' + generateSecret(32));
    console.log('');
    
    console.log('💡 Backend Security Tips:');
    console.log('   - Use different secrets for development and production');
    console.log('   - JWT secret should be 64+ characters');
    console.log('   - Never commit .env files to git');
    console.log('   - Use app-specific passwords for email');
    console.log('');
}

// Backend security checklist
function securityChecklist() {
    console.log('🛡️  Backend Security Checklist:\n');
    
    const checks = [
        '.env file is in .gitignore',
        'Strong JWT secret (64+ characters)',
        'Unique session secret',
        'MongoDB user has minimal permissions',
        'Email uses app-specific passwords',
        'CORS configured properly',
        'Rate limiting enabled',
        'Helmet security headers enabled'
    ];
    
    checks.forEach((check, index) => {
        console.log(`   ${index + 1}. [ ] ${check}`);
    });
    
    console.log('');
}

// Validate current environment
function validateEnvironment() {
    const envFile = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envFile)) {
        console.log('⚠️  Cannot validate - .env file not found\n');
        return;
    }
    
    console.log('🔍 Validating current environment...\n');
    
    const envContent = fs.readFileSync(envFile, 'utf8');
    const lines = envContent.split('\n');
    
    const checks = {
        'JWT_SECRET': false,
        'MONGODB_URI': false,
        'EMAIL_PASS': false,
        'NODE_ENV': false
    };
    
    lines.forEach(line => {
        Object.keys(checks).forEach(key => {
            if (line.startsWith(key + '=') && line.split('=')[1].trim()) {
                checks[key] = true;
            }
        });
    });
    
    Object.entries(checks).forEach(([key, exists]) => {
        console.log(`   ${exists ? '✅' : '❌'} ${key}`);
    });
    
    console.log('');
}

// Main execution
function main() {
    const envExists = checkEnvFile();
    generateSecrets();
    securityChecklist();
    
    if (envExists) {
        validateEnvironment();
    }
    
    console.log('📚 For more information, see:');
    console.log('   - README.md for complete backend documentation');
    console.log('   - .env.example for all available options');
    console.log('');
    console.log('🎉 Backend setup complete!');
}

// Run the script
main();