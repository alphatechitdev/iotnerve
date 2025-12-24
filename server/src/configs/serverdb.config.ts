
import {createClient} from '@supabase/supabase-js';

const projectURL : string = process.env.SUPABASE_PROJECT_URL || '';
const projectAPI : string = process.env.SUPABASE_PROJECT_API || '';

const supabase = createClient(projectURL, projectAPI);

export default supabase;
