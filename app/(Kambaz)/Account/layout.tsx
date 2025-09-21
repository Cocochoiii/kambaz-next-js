import AccountNavigation from "./Navigation";

export default function AccountLayout({children}:{children:React.ReactNode}){
    return (
        <div id="wd-kambaz">
            <table><tbody><tr>
                <td valign="top"><AccountNavigation/></td>
                <td valign="top" width="100%">{children}</td>
            </tr></tbody></table>
        </div>
    );
}
