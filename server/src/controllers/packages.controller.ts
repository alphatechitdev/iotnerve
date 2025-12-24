import supabase from "@/configs/serverdb.config";

class PackagesController {
    constructor () {

    }
    
    async findPackage(package_name:string) {

        const {data, error} = await supabase.from('packages').select('*').eq('package', package_name)

        if(error) {
            console.log(error);
            return 
        }

        if(data.length>0){
            console.log("Fetched",data[0])
            const packageDetails = data[0];
            return packageDetails;
        }
    }
}

export default PackagesController;