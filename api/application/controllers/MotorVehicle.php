<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class MotorVehicle extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('MotorVehicleModel');

	}

	public function index_get()
	{
		$motorVehicleModel = new MotorVehicleModel;
		$result = $motorVehicleModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$motorVehicleModel = new MotorVehicleModel;
		$result = $motorVehicleModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$motorVehicleModel = new MotorVehicleModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		

		$data = array(
			'office' => $requestData['office'],
			'plate_number' => $requestData['plate_number'],
			'model' => $requestData['model'],
			'engine_number' => $requestData['engine_number'],
			'chassis_number' => $requestData['chassis_number'],
			'date_acquired' => $requestData['date_acquired'],
			'cost' => $requestData['cost'],
			'status' => $requestData['status'],
			'return_number' => $requestData['return_number'],
			'return_date' => $requestData['return_date'],
			'vehicle_type' => $requestData['vehicle_type'],
			'quantity' => $requestData['quantity'],
			'fuel_type' => $requestData['fuel_type'],
			'vehicle_use' =>  implode(', ', $requestData['vehicle_use']),
			'cylinder_number' => $requestData['cylinder_number'],
			'engine_displacement' => $requestData['engine_displacement'] 

		);
		// $this->response($data, RestController::HTTP_OK);

		$result = $motorVehicleModel->insert($data);
	
		$this->response($result, RestController::HTTP_OK);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new motor vehicle.'
			], RestController::HTTP_OK);
		}
	}

	public function update_put($id)
	{


		$motorVehicleModel = new MotorVehicleModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['office'])) {
			$data['office'] =  $requestData['office'];
		} 
		if (isset($requestData['plate_number'])) {
			$data['plate_number'] =  $requestData['plate_number'];
		} 
		if (isset($requestData['model'])) {
			$data['model'] =  $requestData['model'];
		} 
		if (isset($requestData['engine_number'])) {
			$data['engine_number'] =  $requestData['engine_number'];
		} 
		if (isset($requestData['chassis_number'])) {
			$data['chassis_number'] =  $requestData['chassis_number'];
		} 
		if (isset($requestData['date_acquired'])) {
			$data['date_acquired'] =  $requestData['date_acquired'];
		} 
		if (isset($requestData['cost'])) {
			$data['cost'] =  $requestData['cost'];
		} 
		if (isset($requestData['status'])) {
			$data['status'] =  $requestData['status'];
		} 
		if (isset($requestData['return_number'])) {
			$data['return_number'] =  $requestData['return_number'];
		} 
		if (isset($requestData['return_date'])) {
			$data['return_date'] =  $requestData['return_date'];
		} 
		if (isset($requestData['vehicle_type'])) {
			$data['vehicle_type'] =  $requestData['vehicle_type'];
		} 
		if (isset($requestData['quantity'])) {
			$data['quantity'] =  $requestData['quantity'];
		} 
		if (isset($requestData['fuel_type'])) {
			$data['fuel_type'] =  $requestData['fuel_type'];
		} 
		if (isset($requestData['vehicle_use'])) {
			$data['vehicle_use'] =   implode(', ', $requestData['vehicle_use']);	
		} 
		if (isset($requestData['cylinder_number'])) {
			$data['cylinder_number'] =  $requestData['cylinder_number'];
		} 
		if (isset($requestData['engine_displacement'])) {
			$data['engine_displacement'] =  $requestData['engine_displacement'];
		} 
		$update_result = $motorVehicleModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_OK);

		}
	}


	public function delete_delete($id)
	{
		$motorVehicleModel = new MotorVehicleModel;
		$result = $motorVehicleModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_OK);

		}
	}


}
