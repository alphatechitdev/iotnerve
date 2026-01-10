import supabase from "@/configs/serverdb.config";


const verifyProfileToUser = async (user_id: string, profile_id:string) => {
    try {
        const {data, error} = await supabase.from('profiles').select('user_id').eq('user_id', user_id).eq('profile_id', profile_id);

        if (error) {
            console.error("Error While Confirming Profile & User Access!", error);
            return res.status(500).json({message:"Internal Server Error!"});
        }
        if (data.length == 0) {
            return res.status(403).json({message:"Forbidden!"})
        }

    } catch (error) {
        console.error("Error While Confirming Profile & User Access!", error);
        return res.status(500).json({message:"Internal Server Error!"});
    }
};

export default verifyProfileToUser;