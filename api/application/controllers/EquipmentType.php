<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class EquipmentType extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('EquipmentTypeModel');

	}

	public function index_get()
	{
		$equipmentTypeModel = new EquipmentTypeModel;
		$result = $equipmentTypeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$equipmentTypeModel = new EquipmentTypeModel;
		$result = $equipmentTypeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$equipmentTypeModel = new EquipmentTypeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'equipment_type' => trim($requestData['equipment_type']),
			'code ' => trim($requestData['code']), 

		);

		$result = $equipmentTypeModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_OK);
		}
	}

	public function update_put($id)
	{


		$equipmentTypeModel = new EquipmentTypeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
	
		if (isset($requestData['equipment_type'])) {
			$data['equipment_type'] = trim($requestData['equipment_type']);
		}
		if (isset($requestData['code'])) {
			$data['code'] = trim($requestData['code']);
		} 

		$update_result = $equipmentTypeModel->update($id, $data);

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
		$equipmentTypeModel = new EquipmentTypeModel;
		$result = $equipmentTypeModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
