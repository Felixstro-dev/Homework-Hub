# Appwrite Datenbank Setup

## Datenbank konfigurieren

Um die Hausaufgaben-Funktionen zu nutzen, musst du in Appwrite eine Datenbank einrichten:

### 1. Datenbank erstellen

1. Gehe zu deinem Appwrite-Dashboard: https://appwrite.chjk.xyz
2. Klicke auf "Databases" in der linken Navigation
3. Erstelle eine neue Datenbank mit der ID: `homework-db`

### 2. Collection erstellen

Erstelle eine neue Collection mit folgenden Einstellungen:

- **Collection ID**: `tasks`
- **Collection Name**: Tasks

### 3. Attribute hinzufügen

Füge folgende Attribute zur Collection hinzu:

| Attribut Name | Typ      | Größe | Erforderlich | Array |
|--------------|----------|-------|--------------|-------|
| `title`      | String   | 255   | Ja           | Nein  |
| `description`| String   | 1000  | Nein         | Nein  |
| `dueDate`    | String   | 50    | Nein         | Nein  |
| `completed`  | Boolean  | -     | Ja           | Nein  |
| `userId`     | String   | 255   | Ja           | Nein  |

### 4. Berechtigungen setzen

Konfiguriere die Berechtigungen für die Collection:

**Document Security**: Aktiviert

**Permissions**:
- Role: `Users`
  - Create: ✅
  - Read: ✅
  - Update: ✅
  - Delete: ✅

### 5. Index erstellen (Optional, für bessere Performance)

Erstelle einen Index:
- **Key**: `userId_index`
- **Type**: Key
- **Attributes**: `userId` (ASC)

## Funktionen

Nach dem Setup kannst du:

✅ **Neue Aufgaben hinzufügen** - Klicke auf "Neue Aufgabe" und fülle das Formular aus  
✅ **Aufgaben abhaken** - Checkbox anklicken um Aufgaben als erledigt zu markieren  
✅ **Aufgaben bearbeiten** - Klicke auf das Stift-Icon ✏️  
✅ **Aufgaben löschen** - Klicke auf das Mülleimer-Icon 🗑️  
✅ **Persönliche Aufgaben** - Jeder Benutzer sieht nur seine eigenen Aufgaben

## Fehlerbehebung

Falls Fehler auftreten:

1. Überprüfe, ob die Datenbank-ID und Collection-ID korrekt sind
2. Stelle sicher, dass alle Attribute korrekt erstellt wurden
3. Überprüfe die Berechtigungen
4. Schaue in die Browser-Konsole für detaillierte Fehlermeldungen
