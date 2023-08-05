import {
  Box,
  Button,
  Card,
  CardActionArea,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";

const BillingDetails = (props) => {
  const { totalMRPCost, totalSellingCost, cartItemsData, noOfItems, btnText } = props;

  return (
    <>
      <Card sx={{ mt: "24px" }}>
        <Box className="recieptTitle" py={2} px={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Billing Details
          </Typography>
        </Box>
        <Stack spacing={2} px={3}>
          <Box
            component="span"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              Total MRP (Incl. of taxes)
            </Typography>
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              ₹{totalMRPCost}
            </Typography>
          </Box>
          <Box
            component="span"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              Shipping Charges
            </Typography>
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              ₹0
            </Typography>
          </Box>
          <Box
            component="span"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              Product Discount(s)
            </Typography>
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              - ₹{totalMRPCost - totalSellingCost}
            </Typography>
          </Box>
          <Box
            component="span"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{ color: "#4a4a4a" }}
              fontSize="16px"
              fontWeight={600}
            >
              Subtotal
            </Typography>
            <Typography
              sx={{ color: "#4a4a4a" }}
              fontSize="16px"
              fontWeight={600}
            >
              ₹{totalSellingCost}
            </Typography>
          </Box>
          <Box
            component="span"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              Coupon Discount
            </Typography>
            <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
              - ₹0
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mt: "32px" }} />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={3}
          py={4}
        >
          <Box>
            <Typography fontSize="21px" fontWeight={600}>
              Total
            </Typography>
            <Typography fontSize="21px" fontWeight={500}>
              ₹{totalSellingCost}
            </Typography>
          </Box>

          <Button
            startIcon={<ShoppingCartCheckoutOutlinedIcon />}
            disableElevation
            sx={{
              width: "60%",
              py: "12px",
              letterSpacing: "1px",
              fontWeight: 500,
            }}
            size="large"
            variant="contained"
            disabled={noOfItems > 0 ? false : true}
          >
            {btnText}
          </Button>
        </Stack>
      </Card>
    </>
  );
};

export default BillingDetails;
