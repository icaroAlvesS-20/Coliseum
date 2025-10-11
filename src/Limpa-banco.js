import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function limparBanco() {
    try {
        await prisma.$connect();
        console.log('✅ Conectado ao banco');
        
        // Contar usuários antes
        const countBefore = await prisma.usuario.count();
        console.log('👥 Usuários antes:', countBefore);
        
        // Deletar TODOS os usuários
        await prisma.usuario.deleteMany({});
        
        // Contar usuários depois
        const countAfter = await prisma.usuario.count();
        console.log('🧹 Usuários depois:', countAfter);
        console.log('✅ Banco limpo com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

limparBanco();