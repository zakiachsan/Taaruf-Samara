# Integration Audit Report - Taaruf Samara
**Date:** 2026-02-10

## 1. Database Schema Issues

### Missing Fields in `user_profiles`
The current schema is missing fields needed by mobile app:
- `full_name` TEXT - Display name
- `gender` TEXT ('male' | 'female') - For matching
- `referral_code` TEXT - Unique referral code
- `is_verified` BOOLEAN - Profile verification
- `updated_at` TIMESTAMPTZ - Last update

### Column Name Mismatch - `banners`
- Schema uses: `"order"`
- Mobile app uses: `display_order`

### Missing Tables
- `chats` - Chat rooms
- `chat_messages` - Chat messages
- `referral_withdrawals` - Withdrawal requests

## 2. CMS Admin Issues

### Missing Components (Placeholder Only)
- Banner Management
- Self-Value Management
- Matches Management
- Settings

### No Auth Flow
- No login page
- Anyone can access admin panel
- Need admin role check

## 3. Type Mismatches

### Mobile vs CMS Types
| Field | Mobile | CMS | Fix |
|-------|--------|-----|-----|
| UserProfile.is_verified | boolean | (missing) | Add to CMS |
| UserProfile.is_premium | (missing) | boolean | Different purpose |
| Banner.display_order | number | order | Standardize |
| ChatMessage.chat_id | chat_id | match_id | Fix mobile |

## 4. Fixes Required

### High Priority
1. Update database schema with missing columns
2. Fix Banner column name (use `display_order`)
3. Add missing tables (chats, chat_messages, referral_withdrawals)
4. Sync types between mobile and CMS

### Medium Priority
5. Add auth flow to CMS admin
6. Create Banner management in CMS
7. Create SelfValue management in CMS

### Low Priority
8. Create Matches management in CMS
9. Add Settings page

## 5. Migration SQL

See `/supabase/migrations/20260210_schema_fixes.sql`
