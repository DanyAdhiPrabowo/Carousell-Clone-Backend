'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');

function getTime(){
	const today 	= new Date();
	const date 		= today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	const time 		= today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	const dateTime 	= date+' '+time;
	return dateTime;
}


exports.getCheckout = function(req, res){

	// const id_order 		= req.query.id_order;
	const id_user 		= req.query.id_user;


	const query 		=  `SELECT checkout.id_checkout, checkout.id_order, checkout.id_user, checkout.id_product, checkout.total_product, checkout.total_price, product.id_user as id_seller, product.product_name, product.image as image_product, user.username, user.image as image_seller
							FROM checkout 
							INNER JOIN product ON checkout.id_product=product.id_product
							INNER JOIN user ON product.id_user=user.id_user
							WHERE checkout.id_user=${id_user}`;
		connection.query(
			query,
			function(error, rows, field){
				if(error){
					console.log(error);
				}else{
					if(rows!=''){
						return res.send({
							data  : rows,
						})
					}else{
						return res.send({
							message:'Data not found',
						})
					}

				}

			}

		)
}


exports.createCheckout = function(req, res){
	// ambil data id_user, id_product, total_product, total_price dari table cart
	// ambil data id_order dari frontend
	const id_order 			= req.body.id_order;
	const id_user 			= req.body.id_user;
	const id_product 		= req.body.id_product;
	const total_product		= req.body.total_product;
	const id_address		= req.body.id_address;
	const total_price		= req.body.total_price;
	const id_payment_method	= req.body.id_payment_method;


	if(!id_user){
		res.status(400).send('Id User is required');
	}else if(!id_product){
		res.status(400).send('Id Product is required');
	}else if(!total_product){
		res.status(400).send('Total Product is required');
	}else if(!id_address){
		res.status(400).send('Id address is required');
	}else{ 
		// const id_order = Math.random().toString(36).substring(2, 15);
		const dateTime = getTime();
		let sql = `INSERT INTO checkout set id_order='${id_order}', id_user=${id_user}, id_product=${id_product}, total_product=${total_product}, id_address=${id_address}, total_price=${total_price}, id_payment_method=${id_payment_method}, date_checkout='${dateTime}'`;
		sql = sql.replace(/\/+/gi, '')
		connection.query(sql
			,
			function(error, rows, field){
				if(error){
					console.log(error)
				}else{
					connection.query(
						`Delete from cart where id_user=?`,
						[id_user],
						function(err, rowss, field){
							if(err){
								console.log(err);
							}else{
								return res.send({
									data  : rows,
								})
							}
						}
					)
				}
			}
		)
		
	}
}


exports.deleteCheckout  = function(req, res){

	const id_order 	= req.query.id_order;

	connection.query(
		`Delete from checkout where id_order=\'${id_order}\'`,
		function(error, rows, field){
			if(error){
				console.log(error)
			}else{
				if(rows.affectedRows != ""){
					return res.send({
						message :'Data has been delete',
						data 	: {id_order}
					})
				}else{
					return res.status(400).send ({ 
						message : "Id not valid.",
					})
				}
			}
		}
	)
}

exports.multipleInsert 		= function(req, res){
	const id_order 			= Math.random().toString(36).substring(2, 15);
	const id_user 			= req.body.id_user;
	const id_product 		= req.body.id_product;
	const total_product		= req.body.total_product;
	const id_address		= req.body.id_address;
	const total_price		= req.body.total_price;
	const id_payment_method	= req.body.id_payment_method;
	const date 				= getTime();
	const records = [
		                [id_order, id_user, id_product, total_product, id_address, total_price, id_payment_method, date]
					];

	let sql = "INSERT INTO checkout (id_order, id_user, id_product, total_product, id_address, total_price, id_payment_method, date_checkout) VALUES ?";


	const query = connection.query(sql, [records], 

		function(error, result) {
		if(error){
			console.log(error)
		}else{
	    	return res.send({
				data  : result,
			})
		}
	});
}


// const query 		=  `SELECT checkout.id_checkout,checkout.id_order, checkout.id_user, user.username, user.firstname, user.lastname, user.email, user.hp, checkout.id_product, checkout.total_product,checkout.total_price, product.product_name, product.price, address.address, payment_method.name_payment_method  FROM checkout
// 						    INNER JOIN address ON checkout.id_address=address.id_address
// 						    INNER JOIN user ON checkout.id_user=user.id_user
// 						    INNER JOIN product ON checkout.id_product=product.id_product
// 						    INNER JOIN payment_method ON checkout.id_payment_method=payment_method.id_payment_method
// 						    WHERE id_user=${id_user}`;