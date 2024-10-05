import { Box, Button, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { DataItem, Handlers } from "../types/types";
import ContentTable from "../components/ViewPdf/ContentTable";

const DoneUploadPage = () => {
    const [data, setData] = useState<DataItem[]>([]);

    useEffect(() => {
        // fetch from http://127.0.0.1:8000/questions/
        fetch("http://127.0.0.1:8000/questions/")
            .then((response) => response.json())
            // .then((data) => console.log(data));
            .then((data) => setData(data));
    }, []);

    // TODO (desmond): optimisation to event handlers
    // Event Handlers
    const handleTopicsChange = (index: number, newChips: string[]) => {
        const updatedData = [...data];
        updatedData[index].topics = newChips;
        setData(updatedData);
    };

    const handleDescriptionChange = useCallback(
        (index: number, newDescription: string) => {
            setData((prevData) => {
                const updatedData = [...prevData];
                updatedData[index] = {
                    ...updatedData[index],
                    description: newDescription,
                };
                return updatedData;
            });
            const updatedData = [...data];
            updatedData[index].description = newDescription;
        },
        [data]
    );

    const handleDifficultyChange = (index: number, newDifficulty: number) => {
        const updatedData = [...data];
        updatedData[index].difficulty = newDifficulty;
        setData(updatedData);
        console.log(data);
    };

    const handlers: Handlers = {
        handleTopicsChange,
        handleDescriptionChange,
        handleDifficultyChange,
    };

    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
            sx={{ width: { lg: "90%", xl: "78%" } }}
            mx={"auto"}
        >
            <Box
                display={"flex"}
                width={"100%"}
                padding={"1rem"}
                mt={"2rem"}
                justifyContent={"space-between"}
            >
                {/* This is the uploaded paper title */}
                <Typography fontWeight={"bolder"} fontSize={"1.8rem"}>
                    CS2105 - Computer Networks Finals 2023/2024 Semester 2
                </Typography>
                <Box
                    width={"13rem"}
                    padding={"1rem"}
                    borderRadius={"0.5rem"}
                    sx={{ background: "rgb(222, 242, 255)" }}
                >
                    <Typography textAlign={"start"}>
                        Please Check Through The Parsed Paper Before Proceeding.
                    </Typography>
                </Box>
            </Box>

            {/* This is the table of questions and its details */}
            <ContentTable data={data} handlers={handlers} />

            <Button
                sx={{ alignSelf: "flex-end", margin: "1rem" }}
                variant="contained"
                size="large"
            >
                Continue
            </Button>
        </Box>
    );
};

export default DoneUploadPage;

// import { Box, Button, Typography } from "@mui/material";
// import { useState } from "react";
// import { DataItem, Handlers } from "../types/types";
// import ContentTable from "../components/ViewPdf/ContentTable";

// const DoneUploadPage = () => {
//     // Dummy data -> To be removed once API and Backend is integrated

//     function createData(
//         question: number,
//         description: string,
//         topics: string[],
//         difficulty: number
//     ): DataItem {
//         return { question, description, topics, difficulty };
//     }

//     const [data, setData] = useState([
//         createData(
//             1,
//             "What is the function of a router in a network, and how does it differ from other networking devices like switches and hubs?",
//             ["Routing", "Networking Devices"],
//             3
//         ),
//         createData(
//             2,
//             "Explain the differences between TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), including their use cases and how their characteristics affect data transmission.",
//             ["Protocols", "TCP/IP"],
//             5
//         ),
//         createData(
//             3,
//             "What is an IP address, and how is it structured in terms of its components? Include an explanation of IPv4 and IPv6 addressing formats and their significance.",
//             ["IP Addressing", "Networking"],
//             2
//         ),
//         createData(
//             4,
//             "What are the main differences between IPv4 and IPv6, and how do these differences impact network configuration, address space, and overall internet functionality?",
//             ["IP Addressing", "IPv4 vs IPv6"],
//             6
//         ),
//         createData(
//             5,
//             "Describe the OSI (Open Systems Interconnection) model and its seven layers. Explain the function of each layer and how they interact to enable network communication.",
//             ["OSI Model", "Networking Architecture"],
//             7
//         ),
//         createData(
//             6,
//             "What is a subnet mask, and how is it used in the process of subnetting IP addresses? Include an explanation of how subnet masks help in dividing a network into smaller sub-networks.",
//             ["Subnetting", "IP Addressing"],
//             8
//         ),
//         createData(
//             7,
//             "Explain how the Domain Name System (DNS) works to translate domain names into IP addresses. Discuss the role of DNS servers and how they contribute to the resolution process.",
//             ["DNS", "Name Resolution"],
//             4
//         ),
//         createData(
//             8,
//             "What is a MAC (Media Access Control) address, and how does it differ from an IP address? Provide details on how MAC addresses are used in network communication and their importance in local network management.",
//             ["MAC Address", "Networking"],
//             3
//         ),
//         createData(
//             9,
//             "What is Network Address Translation (NAT), and how does it enable multiple devices on a local network to share a single public IP address? Discuss different types of NAT and their implications for network security and communication.",
//             ["NAT", "Networking"],
//             5
//         ),
//         createData(
//             10,
//             "Explain the purpose of a Virtual Private Network (VPN) in a network environment. Describe how VPNs secure data transmission and provide privacy by creating a secure tunnel over the internet.",
//             ["VPN", "Network Security"],
//             6
//         ),
//     ]);

//     // Event Handlers
//     const handleTopicsChange = (index: number, newChips: string[]) => {
//         const updatedData = [...data];
//         updatedData[index].topics = newChips;
//         setData(updatedData);
//     };

//     const handleDescriptionChange = (index: number, newDescription: string) => {
//         const updatedData = [...data];
//         updatedData[index].description = newDescription;
//         setData(updatedData);
//         console.log(data);
//     };

//     const handleDifficultyChange = (index: number, newDifficulty: number) => {
//         const updatedData = [...data];
//         updatedData[index].difficulty = newDifficulty;
//         setData(updatedData);
//         console.log(data);
//     };

//     const handlers: Handlers = {
//         handleTopicsChange,
//         handleDescriptionChange,
//         handleDifficultyChange,
//     };

//     return (
//         <Box
//             display={"flex"}
//             alignItems={"center"}
//             flexDirection={"column"}
//             sx={{ width: { lg: "90%", xl: "78%" } }}
//             mx={"auto"}
//         >
//             <Box
//                 display={"flex"}
//                 width={"100%"}
//                 padding={"1rem"}
//                 mt={"2rem"}
//                 justifyContent={"space-between"}
//             >
//                 {/* This is the uploaded paper title */}
//                 <Typography fontWeight={"bolder"} fontSize={"1.8rem"}>
//                     CS2105 - Computer Networks Finals 2023/2024 Semester 2
//                 </Typography>
//                 <Box
//                     width={"13rem"}
//                     padding={"1rem"}
//                     borderRadius={"0.5rem"}
//                     sx={{ background: "rgb(222, 242, 255)" }}
//                 >
//                     <Typography textAlign={"start"}>
//                         Please Check Through The Parsed Paper Before Proceeding.
//                     </Typography>
//                 </Box>
//             </Box>

//             {/* This is the table of questions and its details */}
//             <ContentTable data={data} handlers={handlers} />

//             <Button
//                 sx={{ alignSelf: "flex-end", margin: "1rem" }}
//                 variant="contained"
//                 size="large"
//             >
//                 Continue
//             </Button>
//         </Box>
//     );
// };

// export default DoneUploadPage;
