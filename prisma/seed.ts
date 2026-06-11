import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const RBA_USERS = [
  {
    username: 'admin001',
    email: 'admin@transitpro.ml',
    name: 'Seydou Diarra',
    password: 'transit2026',
    role: 'admin',
    permissions: JSON.stringify([
      'dashboard:read', 'dashboard:write',
      'dossiers:read', 'dossiers:write', 'dossiers:delete',
      'clients:read', 'clients:write', 'clients:delete',
      'transport:read', 'transport:write', 'transport:delete',
      'depots:read', 'depots:write', 'depots:delete',
      'facturation:read', 'facturation:write', 'facturation:delete',
      'ged:read', 'ged:write', 'ged:delete',
      'securite:read', 'securite:write',
      'users:read', 'users:write', 'users:delete',
      'audit:read', 'parametres:read', 'parametres:write',
      'corridors:read', 'corridors:write',
      'calculatrice:read',
      'surestaries:read', 'surestaries:write',
    ]),
    phone: '+223 70 00 00 01',
    initials: 'SD',
    active: true,
  },
  {
    username: 'dir001',
    email: 's.diarra@transitpro.ml',
    name: 'Amadou Diallo',
    password: 'transit2026',
    role: 'directeur',
    permissions: JSON.stringify([
      'dashboard:read', 'dashboard:write',
      'dossiers:read', 'dossiers:write',
      'clients:read', 'clients:write',
      'transport:read',
      'depots:read',
      'facturation:read', 'facturation:write',
      'ged:read',
      'corridors:read', 'calculatrice:read', 'surestaries:read',
      'audit:read', 'parametres:read',
    ]),
    phone: '+223 70 00 00 02',
    initials: 'AD',
    active: true,
  },
  {
    username: 'decl001',
    email: 'a.konate@transitpro.ml',
    name: 'Aminata Konaté',
    password: 'transit2026',
    role: 'declarant',
    permissions: JSON.stringify([
      'dashboard:read',
      'dossiers:read', 'dossiers:write',
      'clients:read',
      'ged:read', 'ged:write',
      'corridors:read', 'calculatrice:read',
    ]),
    phone: '+223 70 00 00 03',
    initials: 'AK',
    active: true,
  },
  {
    username: 'agent001',
    email: 'f.traore@transitpro.ml',
    name: 'Fatoumata Traoré',
    password: 'transit2026',
    role: 'agent',
    permissions: JSON.stringify([
      'dashboard:read',
      'dossiers:read', 'dossiers:write',
      'ged:read', 'ged:write',
      'clients:read',
    ]),
    phone: '+223 70 00 00 04',
    initials: 'FT',
    active: true,
  },
  {
    username: 'mag001',
    email: 'i.sidibe@transitpro.ml',
    name: 'Ibrahim Sidibé',
    password: 'transit2026',
    role: 'magasinier',
    permissions: JSON.stringify([
      'dashboard:read',
      'depots:read', 'depots:write',
      'surestaries:read', 'surestaries:write',
      'ged:read',
    ]),
    phone: '+223 70 00 00 05',
    initials: 'IS',
    active: true,
  },
  {
    username: 'trans001',
    email: 'o.dembele@transitpro.ml',
    name: 'Oumar Dembélé',
    password: 'transit2026',
    role: 'transport',
    permissions: JSON.stringify([
      'dashboard:read',
      'transport:read', 'transport:write',
      'corridors:read',
    ]),
    phone: '+223 70 00 00 06',
    initials: 'OD',
    active: true,
  },
  {
    username: 'compt001',
    email: 'a.coulibaly@transitpro.ml',
    name: 'Aminata Coulibaly',
    password: 'transit2026',
    role: 'comptable',
    permissions: JSON.stringify([
      'dashboard:read',
      'facturation:read', 'facturation:write',
      'clients:read',
    ]),
    phone: '+223 70 00 00 07',
    initials: 'AC',
    active: true,
  },
  {
    username: 'comm001',
    email: 'm.sissoko@transitpro.ml',
    name: 'Mamadou Sissoko',
    password: 'transit2026',
    role: 'commercial',
    permissions: JSON.stringify([
      'dashboard:read',
      'clients:read', 'clients:write',
      'facturation:read',
    ]),
    phone: '+223 70 00 00 08',
    initials: 'MS',
    active: true,
  },
  {
    username: 'audit001',
    email: 'd.keita@transitpro.ml',
    name: 'Djénéba Keïta',
    password: 'transit2026',
    role: 'auditeur',
    permissions: JSON.stringify([
      'dashboard:read',
      'dossiers:read', 'clients:read', 'transport:read',
      'depots:read', 'facturation:read', 'ged:read',
      'audit:read', 'securite:read',
    ]),
    phone: '+223 70 00 00 09',
    initials: 'DK',
    active: true,
  },
  {
    username: 'agent002',
    email: 'b.sangare@transitpro.ml',
    name: 'Boubacar Sangaré',
    password: 'transit2026',
    role: 'agent',
    permissions: JSON.stringify([
      'dashboard:read',
      'dossiers:read', 'dossiers:write',
      'ged:read', 'ged:write',
      'clients:read',
    ]),
    phone: '+223 70 00 00 10',
    initials: 'BS',
    active: false,
  },
]

const AUDIT_LOGS = [
  { userId: '', action: 'CONNEXION', entity: 'Auth', entityId: null, details: 'Connexion réussie depuis Bamako', createdAt: new Date('2026-03-10T08:30:00') },
  { userId: '', action: 'CREATION', entity: 'Dossier', entityId: 'DOS-2026-001', details: 'Création dossier import - Client: SOMATRA', createdAt: new Date('2026-03-10T08:45:00') },
  { userId: '', action: 'MODIFICATION', entity: 'Dossier', entityId: 'DOS-2026-001', details: 'Statut changé: Ouvert → En cours', createdAt: new Date('2026-03-10T09:15:00') },
  { userId: '', action: 'CREATION', entity: 'Facture', entityId: 'FAC-2026-012', details: 'Facture honoraires 1 250 000 FCFA', createdAt: new Date('2026-03-10T09:30:00') },
  { userId: '', action: 'DEPOT_FICHIER', entity: 'Document', entityId: null, details: 'Upload BL MAEU-123456', createdAt: new Date('2026-03-10T10:00:00') },
  { userId: '', action: 'MODIFICATION', entity: 'Mission', entityId: 'MIS-2026-003', details: 'Statut mission: En cours → Livrée', createdAt: new Date('2026-03-10T10:30:00') },
  { userId: '', action: 'PAIEMENT', entity: 'Payment', entityId: 'PAY-2026-005', details: 'Règlement 800 000 FCFA - Virement', createdAt: new Date('2026-03-10T11:00:00') },
  { userId: '', action: 'CREATION', entity: 'Client', entityId: null, details: 'Nouveau client: COMATEX SA', createdAt: new Date('2026-03-10T11:15:00') },
  { userId: '', action: 'MODIFICATION', entity: 'Depot', entityId: null, details: 'Entrée conteneur MSKU-789012 - Dépôt BKO-1', createdAt: new Date('2026-03-10T11:45:00') },
  { userId: '', action: 'SUPPRESSION', entity: 'Document', entityId: null, details: 'Document obsolète supprimé (version 1)', createdAt: new Date('2026-03-10T12:00:00') },
  { userId: '', action: 'CONNEXION', entity: 'Auth', entityId: null, details: 'Connexion réussie', createdAt: new Date('2026-03-10T13:00:00') },
  { userId: '', action: 'MODIFICATION', entity: 'Dossier', entityId: 'DOS-2026-005', details: 'Déclaration déposée - N° DEC-2026-089', createdAt: new Date('2026-03-10T13:30:00') },
  { userId: '', action: 'CREATION', entity: 'Dossier', entityId: 'DOS-2026-008', details: 'Création dossier export - Client: MALITEXT', createdAt: new Date('2026-03-09T08:15:00') },
  { userId: '', action: 'MODIFICATION', entity: 'User', entityId: null, details: 'Désactivation compte agent002', createdAt: new Date('2026-03-09T09:00:00') },
  { userId: '', action: 'CONNEXION', entity: 'Auth', entityId: null, details: 'Échec de connexion - identifiant invalide', createdAt: new Date('2026-03-09T09:30:00') },
  { userId: '', action: 'MODIFICATION', entity: 'User', entityId: null, details: 'Modification permissions utilisateur decl001', createdAt: new Date('2026-03-09T10:00:00') },
  { userId: '', action: 'CREATION', entity: 'Invoice', entityId: 'FAC-2026-011', details: 'Facture droits et taxes 4 500 000 FCFA', createdAt: new Date('2026-03-09T10:30:00') },
  { userId: '', action: 'PAIEMENT', entity: 'Payment', entityId: 'PAY-2026-004', details: 'Règlement 3 200 000 FCFA - Espèces', createdAt: new Date('2026-03-09T11:00:00') },
  { userId: '', action: 'MODIFICATION', entity: 'Dossier', entityId: 'DOS-2026-003', details: 'Ajout BL: MAEU-654321', createdAt: new Date('2026-03-08T14:00:00') },
  { userId: '', action: 'CREATION', entity: 'Mission', entityId: 'MIS-2026-005', details: 'Mission Dakar→Bamako - Véhicule BK-4521-AB', createdAt: new Date('2026-03-08T15:00:00') },
  { userId: '', action: 'CONNEXION', entity: 'Auth', entityId: null, details: 'Connexion réussie depuis Kayes', createdAt: new Date('2026-03-08T07:45:00') },
  { userId: '', action: 'MODIFICATION', entity: 'Dossier', entityId: 'DOS-2026-002', details: 'Statut changé: En cours → Dédouané', createdAt: new Date('2026-03-07T16:30:00') },
  { userId: '', action: 'CREATION', entity: 'Dossier', entityId: 'DOS-2026-010', details: 'Création dossier transit - Client: SIDMA', createdAt: new Date('2026-03-07T09:00:00') },
  { userId: '', action: 'DECONNEXION', entity: 'Auth', entityId: null, details: 'Déconnexion manuelle', createdAt: new Date('2026-03-07T18:00:00') },
  { userId: '', action: 'MODIFICATION', entity: 'Depot', entityId: null, details: 'Sortie marchandise - Dépôt BKO-2', createdAt: new Date('2026-03-06T10:15:00') },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  for (const userData of RBA_USERS) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: userData,
    })
  }
  console.log(`✅ Created ${RBA_USERS.length} users`)

  // Get users for audit logs
  const users = await prisma.user.findMany()
  const userMap = new Map(users.map((u) => [u.role, u.id]))

  // Create audit logs
  for (const log of AUDIT_LOGS) {
    // Assign random user IDs based on action type
    let userId = users[0]?.id
    if (log.action === 'CONNEXION' || log.action === 'DECONNEXION') {
      userId = users[Math.floor(Math.random() * users.length)]?.id
    } else if (log.action === 'CREATION') {
      const possibleUsers = users.filter((u) => ['admin', 'declarant', 'agent', 'comptable', 'commercial'].includes(u.role))
      userId = possibleUsers[Math.floor(Math.random() * possibleUsers.length)]?.id
    } else if (log.action === 'MODIFICATION') {
      const possibleUsers = users.filter((u) => ['admin', 'declarant', 'agent', 'magasinier'].includes(u.role))
      userId = possibleUsers[Math.floor(Math.random() * possibleUsers.length)]?.id
    } else if (log.action === 'PAIEMENT') {
      const possibleUsers = users.filter((u) => u.role === 'comptable')
      userId = possibleUsers[0]?.id
    } else if (log.action === 'SUPPRESSION') {
      userId = userMap.get('admin')
    }

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details,
        createdAt: log.createdAt,
      },
    })
  }
  console.log(`✅ Created ${AUDIT_LOGS.length} audit logs`)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
