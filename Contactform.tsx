import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";

interface ContactData {
  name: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
}

const formSchema = z.object({
  name: z.string(),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  address: z.string(),
  phoneNumber: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().gte(18, "Must be 18 and above")
  ),
});

function ContactForm() {
  const [tableData, setTableData] = useState<ContactData[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const form = useForm<ContactData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phoneNumber:  "",
      address: "",
    },
  });

  const fetchData = () => {
    axios
      .get("https://sheet.best/api/sheets/856a9c9b-ab23-4008-bf3b-4e33f842e2f6")
      .then((response) => {
        console.log("google sheets data >>> ", response);
        setTableData(response.data);
      });
  };

  const submitFormToGoogle = (data: ContactData) => {
    console.log("You submitted the form", data);
    axios
      .post(
        "https://sheet.best/api/sheets/856a9c9b-ab23-4008-bf3b-4e33f842e2f6",
        data
      )
      .then((response) => {
        alert("Row successfully added");
        setTableData([...tableData, data]);
        console.log(response);
      })
      .catch((error) => alert(error.message));

    form.reset();
  };

  return (
    <div>
      <table>
        {/* <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone Number</th>
          </tr>
        </thead> */}
        <tbody>
          {tableData.map(
            ({ name, username, email, address, phoneNumber }, index) => (
              <tr key={index}>
                <td>{name}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td>{address}</td>
                <td>{phoneNumber}</td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitFormToGoogle)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="James" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="bruceLee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full font-raleway" style={{ marginTop: 10 }}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ContactForm;
