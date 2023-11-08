import  { useEffect, useState } from "react";
// import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";


interface ContactData {
  name: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
}

function ContactForm() {
  const { register, handleSubmit, errors } = useForm<ContactData>();
  const [tableData, setTableData] = useState<ContactData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://sheet.best/api/sheets/75e1d79f-6038-4590-85d9-ebbd257edc14")
      .then((response) => {
        console.log("google sheets data >>> ", response);
        setTableData(response.data);
      });
  };

  const submitFormToGoogle = (data: ContactData) => {
    console.log("You submitted the form");
    axios
      .post(
        "https://sheet.best/api/sheets/75e1d79f-6038-4590-85d9-ebbd257edc14",
        data
      )
      .then((response) => {
        alert("Row successfully added");
        setTableData([...tableData, data]);
        console.log(response);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="contactForm">
      <h2>Contact Information</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(({ name, username, email, address, phoneNumber }, index) => (
            <tr key={index}>
              <td>{name}</td>
              <td>{username}</td>
              <td>{email}</td>
              <td>{address}</td>
              <td>{phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit(submitFormToGoogle)}>
        <TextField
          name="name"
          label="Name"
          inputRef={register({ required: true })}
          error={errors.name ? true : false}
          helperText={errors.name && "The Name is Required"}
        />
        <TextField
          name="username"
          label="Username"
          inputRef={register({ required: true })}
          error={errors.username ? true : false}
          helperText={errors.username && "The Username is Required"}
        />
        <TextField
          name="email"
          label="Email"
          inputRef={register({ required: true })}
          error={errors.email ? true : false}
          helperText={errors.email && "The Email is Required"}
        />
        <TextField
          name="address"
          label="Address"
          inputRef={register({ required: true })}
          error={errors.address ? true : false}
          helperText={errors.address && "The Address is Required"}
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          inputRef={register({ required: true })}
          error={errors.phoneNumber ? true : false}
          helperText={errors.phoneNumber && "The Phone Number is Required"}
        />
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default ContactForm;
