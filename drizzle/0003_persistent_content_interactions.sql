ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS media_type text;
ALTER TABLE content_assets ADD COLUMN IF NOT EXISTS size_bytes bigint;
CREATE TABLE IF NOT EXISTS content_block_responses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,enrollment_id uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,program_day_id uuid NOT NULL REFERENCES program_days(id) ON DELETE CASCADE,block_id text NOT NULL,block_type text NOT NULL,value jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),CONSTRAINT content_block_responses_enrollment_day_block_uq UNIQUE(enrollment_id,program_day_id,block_id));
CREATE INDEX IF NOT EXISTS content_block_responses_tenant_user_idx ON content_block_responses(tenant_id,user_id);
CREATE INDEX IF NOT EXISTS content_block_responses_day_idx ON content_block_responses(program_day_id);
